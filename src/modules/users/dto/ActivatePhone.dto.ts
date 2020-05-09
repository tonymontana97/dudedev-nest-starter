import {ApiProperty} from "@nestjs/swagger";
import {IsNumberString, MaxLength, MinLength} from "class-validator";
import {VALIDATION_CONSTANTS} from "../../../shared/constants/validation.constants";

export class ActivatePhoneDto {
    @ApiProperty()
    @IsNumberString()
    @MaxLength(VALIDATION_CONSTANTS.USER_PHONE_CODE_LENGTH)
    @MinLength(VALIDATION_CONSTANTS.USER_PHONE_CODE_LENGTH)
    public code: string;

    @ApiProperty()
    @IsNumberString()
    public userId: string;
}