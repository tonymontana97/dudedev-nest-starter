import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import {AuthGuard, PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {AppConfigModule} from "../../config/app/config.module";
import {AppConfigService} from "../../config/app/config.service";
import {JwtStrategy} from "./jwt.strategy";
import {UsersModule} from "../users/users.module";

@Module({
  imports: [
      UsersModule,
      AppConfigModule,
      PassportModule.register({defaultStrategy: 'jwt'}),
      JwtModule.registerAsync({
          imports: [AppConfigModule],
          useFactory: (appConfigService: AppConfigService) => ({
              secret: appConfigService.jwtSecret,
              signOptions: {
                  expiresIn: appConfigService.jwtExpiresIn
              }
          }),
          inject: [AppConfigService]
      })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
