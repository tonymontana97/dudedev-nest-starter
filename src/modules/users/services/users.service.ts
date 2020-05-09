import {BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {User} from '../entities/User.entity';
import {UserDto} from "../dto/User.dto";
import {UserRepository} from "../repositories/user.repository";
import {UserRolesService} from "./userRoles.service";
import {RedisServiceAdapter} from "../../../shared/redis-adapter/redis-adapter.service";
import {v4 as uuidv4} from 'uuid';
import {MailService} from "../../../shared/mail/mail.service";
import {ActivateEmailDto} from "../dto/ActivateEmail.dto";
import {ERRORS_CONSTANTS} from "../../../shared/constants/errors.constants";
import {SuccessResponseDto} from "../../../shared/dto/SuccessResponse.dto";
import {RequestResetPasswordDto} from "../dto/RequestResetPassword.dto";
import {ResetPasswordDto} from "../dto/ResetPassword.dto";
import {GoogleMapsService} from "../../../shared/google-maps/google-maps.service";
import {SmsAdapterService} from "../../../shared/sms-adapter/sms-adapter.service";
import {ActivatePhoneDto} from "../dto/ActivatePhone.dto";

@Injectable()
export class UsersService {
    constructor(
        public userRepository: UserRepository,
        private readonly userRolesService: UserRolesService,
        private readonly redisServiceAdapter: RedisServiceAdapter,
        private readonly mailService: MailService,
        private readonly googleMapsService: GoogleMapsService,
        private readonly smsAdapterService: SmsAdapterService
    ) {
    }

    public async addNewUser(userDto: UserDto): Promise<UserDto> {
        const {phone, password} = userDto;
        const defaultRole = await this.userRolesService.getDefaultUserRole();
        let user = new User();
        user.roles = [defaultRole];
        user.password = password;
        user.phone = phone;
        user = await this.userRepository.addNewUser(user);

        try {
            await this.redisServiceAdapter.set(user.id.toString(), this.smsAdapterService.codeActivation);
        } catch (e) {
            throw new InternalServerErrorException();
        }

        return user;
    }

    public async activeUserEmail(id: number, activateEmailDto: ActivateEmailDto): Promise<SuccessResponseDto> {
        const { code } = activateEmailDto;
        const redisCode = await this.redisServiceAdapter.get(id.toString());
        if(redisCode) {
            if (code === redisCode) {
                await this.userRepository.activateUserEmail(id);
                await this.redisServiceAdapter.delete(id.toString());
                const response = new SuccessResponseDto();
                response.message = true;
                return response;
            } else {
                throw new BadRequestException(ERRORS_CONSTANTS.CODES.INVALID_CODE_ACTIVATION);
            }
        } else {
            throw new BadRequestException(ERRORS_CONSTANTS.CODES.INVALID_CODE_ACTIVATION)
        }
    }

    public async activateUserPhone(activatePhoneDto: ActivatePhoneDto): Promise<SuccessResponseDto> {
        const { code, userId } = activatePhoneDto;
        const user = await this.userRepository.findOne(userId);

        if(!user) {
            throw new BadRequestException();
        }

        const redisCode = await this.redisServiceAdapter.get(user.id.toString());

        if (!redisCode) {
            throw new BadRequestException();
        }

        if (code !== redisCode) {
            throw new BadRequestException();
        }

        user.phoneActivated = true;
        await user.save();
        await this.redisServiceAdapter.delete(user.id.toString());

        return new SuccessResponseDto();

    }

    public async requestResetPassword(requestResetPassword: RequestResetPasswordDto): Promise<SuccessResponseDto> {
        const { email } = requestResetPassword;
        const user = await this.getByEmail(email);
        const successResponse = new SuccessResponseDto();
        successResponse.message = true;
        if (user) {
            const operationId = uuidv4();
            await this.redisServiceAdapter.set(operationId, user.id.toString());
            await this.mailService.resetPasswordEmail(operationId, user.email);
        }

        return successResponse;
    }
    /*
     * TODO: Check pass and password confirm in DTO
     */
    public async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<SuccessResponseDto> {
        const { code, password } = resetPasswordDto;
        const id = await this.redisServiceAdapter.get(code);
        if(id) {
            await this.redisServiceAdapter.delete(code);
            const user = await this.userRepository.findOne({where: {id}});
            if (!user) {
                throw new BadRequestException(ERRORS_CONSTANTS.CODES.USER_NOT_FOUND);
            }

            user.password = await this.userRepository.hashUserPass(password);
            await user.save();
            return new SuccessResponseDto({message: true});
        } else {
            throw new BadRequestException();
        }
    }

    public async getByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({email});
    }
}
