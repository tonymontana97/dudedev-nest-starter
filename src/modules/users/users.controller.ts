import {Body, ClassSerializerInterceptor, Controller, Get, Post, UseGuards, UseInterceptors} from '@nestjs/common';
import {UsersService} from "./services/users.service";
import {ApiBearerAuth, ApiCreatedResponse, ApiResponse, ApiTags} from '@nestjs/swagger';
import {UserDto} from "./dto/User.dto";
import {User} from "./entities/User.entity";
import {GetUser} from "../auth/get-user.decorator";
import {AuthGuard} from "@nestjs/passport";
import {ActivateEmailDto} from "./dto/ActivateEmail.dto";
import {SuccessResponseDto} from "../../shared/dto/SuccessResponse.dto";
import {RequestResetPasswordDto} from "./dto/RequestResetPassword.dto";
import {ResetPasswordDto} from "./dto/ResetPassword.dto";
import {ActivatePhoneDto} from "./dto/ActivatePhone.dto";

@ApiTags('User')
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) {}

    @Post()
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiCreatedResponse({status: 201, description: 'User created.', type: UserDto})
    public register(
        @Body() userDto: UserDto
    ): Promise<UserDto> {
        return this.usersService.addNewUser(userDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Post('/activate/email')
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiResponse({ status: 200, description: 'User email is activated'})
    public activateEmail(
        @Body() activateEmailDto: ActivateEmailDto,
        @GetUser() user: User
    ): Promise<SuccessResponseDto> {
        return this.usersService.activeUserEmail(user.id, activateEmailDto);
    }

    @Post('/activate/phone')
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiResponse({ status: 200, description: 'User phone is activated'})
    public activatePhone(
        @Body() activatePhoneDto: ActivatePhoneDto,
    ): Promise<SuccessResponseDto> {
        return this.usersService.activateUserPhone(activatePhoneDto);
    }

    @Post('/request-reset-password')
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiResponse({ status: 200, description: 'Reset link send on user mail'})
    public requestResetPassword(
        @Body() requestResetPasswordDto: RequestResetPasswordDto
    ): Promise<SuccessResponseDto> {
        return this.usersService.requestResetPassword(requestResetPasswordDto);
    }

    @Post('/reset-password')
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiResponse({ status: 200, description: 'Password reset.'})
    public resetPassword(
        @Body() resetPasswordDto: ResetPasswordDto
    ): Promise<SuccessResponseDto> {
        return this.usersService.resetPassword(resetPasswordDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/me')
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiBearerAuth()
    public me(
        @GetUser() user: User,
    ) {
        return user;
    }
}
