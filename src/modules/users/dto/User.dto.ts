import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty, MaxLength, MinLength} from "class-validator";
import {VALIDATION_CONSTANTS} from "../../../shared/constants/validation.constants";
import {UserRole} from "../entities/UserRole.entity";
import {User} from "../entities/User.entity";
import {UserRoleDto} from "./UserRole.dto";

export class UserDto {
    @ApiProperty()
    @IsNotEmpty()
    public name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    public email: string;

    @ApiProperty({
        minLength: VALIDATION_CONSTANTS.MIN_USER_PASSWORD_LENGTH,
        maxLength: VALIDATION_CONSTANTS.MAX_USER_PASSWORD_LENGTH
    })
    @IsNotEmpty()
    @MinLength(VALIDATION_CONSTANTS.MIN_USER_PASSWORD_LENGTH)
    @MaxLength(VALIDATION_CONSTANTS.MAX_USER_PASSWORD_LENGTH)
    public password: string;

    // @ApiProperty({
    //     type: UserRoleDto,
    //     isArray: true
    // })
    // public roles: UserRole[];
}
