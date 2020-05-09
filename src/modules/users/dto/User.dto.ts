import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {
    IsDateString,
    IsEmail,
    IsNotEmpty,
    IsPhoneNumber,
    IsString,
    ValidateNested
} from "class-validator";
import {UserAddressDto} from "./UserAddress.dto";
import {Type} from "class-transformer";

export class UserDto {
    @ApiPropertyOptional()
    @IsNotEmpty()
    @IsString()
    public name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    public email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsPhoneNumber('ua')
    public phone: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    public birthday: Date;


    @ApiProperty({
        type: UserAddressDto
    })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => UserAddressDto)
    public address: UserAddressDto;
}
