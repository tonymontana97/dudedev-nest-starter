import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {
    IsEmail,
    IsNotEmpty, IsOptional,
    IsPhoneNumber,
    MaxLength,
    MinLength,
} from "class-validator";
import {VALIDATION_CONSTANTS} from "../../../shared/constants/validation.constants";

export class CreateUserDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsEmail()
    public email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsPhoneNumber('ua')
    public phone: string;


    @ApiProperty({
        minLength: VALIDATION_CONSTANTS.MIN_USER_PASSWORD_LENGTH,
        maxLength: VALIDATION_CONSTANTS.MAX_USER_PASSWORD_LENGTH
    })
    @IsNotEmpty()
    @MinLength(VALIDATION_CONSTANTS.MIN_USER_PASSWORD_LENGTH)
    @MaxLength(VALIDATION_CONSTANTS.MAX_USER_PASSWORD_LENGTH)
    public password: string;
}
