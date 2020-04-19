import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserRepository} from "./repositories/user.repository";
import {UserRolesService} from "./services/userRoles.service";
import {UserRoleRepository} from "./repositories/userRole.repository";
import {RedisAdapterModule} from "../../shared/redis-adapter/redis-adapter.module";
import {MailModule} from "../../shared/mail/mail.module";

@Module({
  imports: [
      RedisAdapterModule,
      MailModule,
      TypeOrmModule.forFeature([UserRepository, UserRoleRepository])
  ],
  providers: [UsersService, UserRolesService],
  controllers: [UsersController],
  exports: [
      UsersService,
      UserRolesService
  ]
})
export class UsersModule {}
