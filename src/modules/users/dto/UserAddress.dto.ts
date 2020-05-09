import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsLatitude, IsLongitude, IsNotEmpty, IsString} from "class-validator";
import {UserAddress} from "../entities/UserAddress.entity";

export class UserAddressDto {
    @ApiPropertyOptional()
    public id: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsLatitude()
    public lat: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsLongitude()
    public lng: string;

    @ApiPropertyOptional()
    public country: string;

    @ApiPropertyOptional()
    public city: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    public address: string;

    constructor(data: UserAddress) {
        Object.assign(this, data);
    }
}