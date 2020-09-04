import { Module } from '@nestjs/common';
import {AppConfigModule} from "./config/app/config.module";
import {DatabaseConfigModule} from "./config/database/postgres/config.module";
import {TypeOrmModule} from '@nestjs/typeorm';
import {DataBaseConfigService} from "./config/database/postgres/config.service";
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import {MailConfigModule} from "./config/mail/config.module";
import {MailerModule} from "@nestjs-modules/mailer";
import {MailConfigService} from "./config/mail/config.service";
import {RedisModule} from "nestjs-redis";
import {RedisConfigModule} from "./config/database/redis/config.module";
import {RedisConfigService} from "./config/database/redis/config.service";
import { RedisAdapterModule } from './shared/redis-adapter/redis-adapter.module';
import { MailModule } from './shared/mail/mail.module';
import { PerchwellService } from './libs/perchwell/perchwell.service';

const configs = [
    AppConfigModule,
    DatabaseConfigModule,
    MailConfigModule,
    RedisConfigModule
];

const modules = [
    UsersModule,
    AuthModule,
    RedisModule
];


const db = [
    TypeOrmModule.forRootAsync({
        imports: [DatabaseConfigModule],
        useFactory: (dataBaseConfigService: DataBaseConfigService) => ({
            type: 'postgres',
            host: dataBaseConfigService.host,
            port: dataBaseConfigService.port,
            username: dataBaseConfigService.user,
            password: dataBaseConfigService.password,
            database: dataBaseConfigService.name,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true
        }),
        inject: [DataBaseConfigService]
    })
];

const mail = [
    MailerModule.forRootAsync({
        imports: [MailConfigModule],
        useFactory: (mailConfigService: MailConfigService) => ({
            transport: {
                host: mailConfigService.protocol,
                port: mailConfigService.port,
                auth: {
                    user: mailConfigService.user,
                    pass: mailConfigService.password
                }
            }
        }),
        inject: [MailConfigService]
    })
];

const redis = [
    RedisModule.forRootAsync({
        imports: [RedisConfigModule],
        useFactory: (redisConfigService: RedisConfigService) => ({
            host: redisConfigService.host,
            port: redisConfigService.port,
            db: redisConfigService.db,
            password: redisConfigService.password,
        }),
        inject: [RedisConfigService]
    })
];

@Module({
  imports: [
      ...configs,
      ...db,
      ...modules,
      ...mail,
      ...redis,
      MailModule,
  ],
  controllers: [],
  providers: [PerchwellService],
})
export class AppModule {}
