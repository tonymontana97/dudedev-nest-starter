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
import {CreateUserDto} from "../dto/CreateUser.dto";
import {UserAddressRepository} from "../repositories/UserAddress.repository";

@Injectable()
export class UsersService {
    constructor(
        public userRepository: UserRepository,
        private userAddressRepository: UserAddressRepository,
        private readonly userRolesService: UserRolesService,
        private readonly redisServiceAdapter: RedisServiceAdapter,
        private readonly mailService: MailService,
        private readonly googleMapsService: GoogleMapsService,
        private readonly smsAdapterService: SmsAdapterService,
    ) {
    }

    public async addNewUser(createUserDto: CreateUserDto): Promise<UserDto> {
        const {email, phone, password} = createUserDto;
        const defaultRole = await this.userRolesService.getDefaultUserRole();
        let user = new User();
        user.roles = [defaultRole];
        user.password = password;
        user.phone = phone;
        user.email = email;

        user = await this.userRepository.addNewUser(user);

        await this.sendActivationPhoneCode(user);

        return user;
    }

    private async sendActivationPhoneCode(user: User): Promise<boolean> {
        try {
            await this.redisServiceAdapter.set(`${user.id.toString()}-phone`, this.smsAdapterService.codeActivation);
        } catch (e) {
            throw new InternalServerErrorException();
        }

        return true;
    }

    private async sendActivationEmailLink(user: User): Promise<boolean> {
        // generate uniq activation id
        const randUUid = uuidv4();
        try {
            // set uniq id to redis temporary
            await this.redisServiceAdapter.set(`${user.id.toString()}-email`, randUUid);
        } catch (e) {
            throw new InternalServerErrorException();
        }

        await this.mailService.sendActivationEmail(randUUid, user.email);

        return true;
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

    public async getByPhone(phone: string): Promise<User> {
        return this.userRepository.findOne({phone});
    }

    /**
     * Update user profile
     * @param userDto
     * @param user
     */
    public async updateProfile(id: number, userDto: UserDto): Promise<UserDto> {
        const {name, birthday, address, email, phone} = userDto;
        const user = await this.userRepository.findOne(id, {
            relations: ['address']
        });
        if (!user) {
            throw new BadRequestException(ERRORS_CONSTANTS.CODES.USER_NOT_FOUND);
        }
        user.name = name;
        user.birthday = birthday;
        user.address = user.address ? await this.userAddressRepository.updateUserAddress(address, user)
                                    : await this.googleMapsService.getUserAddress(address);

        // IF user update phone number we should send activation code again
        if (phone !== user.phone) {
            const isAlreadyExists = await this.userRepository.findOne({phone});
            if (isAlreadyExists && isAlreadyExists.id !== user.id) {
                throw new BadRequestException(ERRORS_CONSTANTS.CODES.USER_ALREADY_EXISTS);
            }

            await this.sendActivationPhoneCode(user);
        }
        user.phone = phone;

        // IF user update email we should send activation link again
        if (email !== user.email) {
            const isAlreadyExists = await this.userRepository.findOne({email});
            if (isAlreadyExists && isAlreadyExists.id !== user.id) {
                throw new BadRequestException(ERRORS_CONSTANTS.CODES.USER_ALREADY_EXISTS);
            }
            user.email = email;
            await this.sendActivationEmailLink(user);
        }
        user.email = email;

        await user.save();

        return user.dto;
    }
}
