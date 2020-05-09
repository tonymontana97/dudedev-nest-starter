import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {
    IsArray,
    IsDate,
    IsDateString,
    IsEmail,
    IsNotEmpty, IsNumberString, IsOptional,
    IsPhoneNumber, IsString,
    MaxLength,
    MinLength,
    ValidateNested
} from "class-validator";
import {VALIDATION_CONSTANTS} from "../../../shared/constants/validation.constants";
import {UserAddressDto} from "./UserAddress.dto";
import {Type} from "class-transformer";

export class UserDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    public name: string;

    @ApiProperty()
    @IsOptional()
    @IsEmail()
    public email: string;

    @ApiPropertyOptional()
    @IsNotEmpty()
    @IsPhoneNumber('ua')
    public phone: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    public birthday: Date;


    @ApiProperty({
        minLength: VALIDATION_CONSTANTS.MIN_USER_PASSWORD_LENGTH,
        maxLength: VALIDATION_CONSTANTS.MAX_USER_PASSWORD_LENGTH
    })
    @IsNotEmpty()
    @MinLength(VALIDATION_CONSTANTS.MIN_USER_PASSWORD_LENGTH)
    @MaxLength(VALIDATION_CONSTANTS.MAX_USER_PASSWORD_LENGTH)
    public password: string;

    @ApiPropertyOptional({
        type: UserAddressDto
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => UserAddressDto)
    public address: UserAddressDto;
}
