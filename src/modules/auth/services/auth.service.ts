import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from "../../users/services/users.service";
import {AuthSuccessDto} from "../dto/authSuccess.dto";
import {AuthDto} from "../dto/auth.dto";
import {User} from "../../users/entities/User.entity";
import {IJwtPayload} from "../types/jwtPayload.interface";
import {JwtService} from "@nestjs/jwt";
import {ERRORS_CONSTANTS} from "../../../shared/constants/errors.constants";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {
    }


    public async validateUser(authDto: AuthDto): Promise<AuthSuccessDto> {
        const { phone, email = null, password } = authDto;
        const user = email ? await this.usersService.getByEmail(email) : await this.usersService.getByPhone(phone);

        // IF user not found in DB
        if (!user || user.phoneActivated) {
            throw new BadRequestException(ERRORS_CONSTANTS.CODES.INVALID_CREDENTIALS);
        }

        const isValidPass = await user.validatePassword(password);
        if (!isValidPass) {
            throw new BadRequestException(ERRORS_CONSTANTS.CODES.INVALID_CREDENTIALS);
        }

        const result = new AuthSuccessDto();
        result.token = this.getUserToken(user);
        return result;
    }

    private getUserToken(user: User): string {
        const payload: IJwtPayload = {
            email: user.email,
            id: user.id
        };

        return this.jwtService.sign(payload);
    }

}
