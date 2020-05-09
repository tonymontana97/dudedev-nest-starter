import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserRepository} from "./repositories/user.repository";
import {UserRolesService} from "./services/userRoles.service";
import {UserRoleRepository} from "./repositories/userRole.repository";
import {RedisAdapterModule} from "../../shared/redis-adapter/redis-adapter.module";
import {MailModule} from "../../shared/mail/mail.module";
import {UserAddressRepository} from "./repositories/UserAddress.repository";
import {UserSpecialityRepository} from "./repositories/UserSpeciality.repository";
import {GoogleMapsModule} from "../../shared/google-maps/google-maps.module";
import {GoogleMapsService} from "../../shared/google-maps/google-maps.service";
import {SmsAdapterModule} from "../../shared/sms-adapter/sms-adapter.module";
import {SmsAdapterService} from "../../shared/sms-adapter/sms-adapter.service";

@Module({
  imports: [
      RedisAdapterModule,
      MailModule,
      GoogleMapsModule,
      SmsAdapterModule,
      TypeOrmModule.forFeature([
          UserRepository,
          UserRoleRepository,
          UserAddressRepository,
          UserSpecialityRepository
      ])
  ],
  providers: [
      UsersService,
      UserRolesService,
      GoogleMapsService,
      SmsAdapterService
  ],
  controllers: [UsersController],
  exports: [
      UsersService,
      UserRolesService
  ]
})
export class UsersModule {}
