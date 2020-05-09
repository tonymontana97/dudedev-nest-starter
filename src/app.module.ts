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
import { MailModule } from './shared/mail/mail.module';
import {SnakeNamingStrategy} from "./snake-naming.strategy";
import {AppConfigService} from "./config/app/config.service";
import { SmsAdapterModule } from './shared/sms-adapter/sms-adapter.module';

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
        imports: [DatabaseConfigModule, AppConfigModule],
        useFactory: (dataBaseConfigService: DataBaseConfigService, appConfigService: AppConfigService) => ({
            type: 'postgres',
            host: dataBaseConfigService.host,
            port: dataBaseConfigService.port,
            username: dataBaseConfigService.user,
            password: dataBaseConfigService.password,
            database: dataBaseConfigService.name,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
            logging: appConfigService.env === 'development',
            namingStrategy: new SnakeNamingStrategy()
        }),
        inject: [DataBaseConfigService, AppConfigService]
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
      SmsAdapterModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
