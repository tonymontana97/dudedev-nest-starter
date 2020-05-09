import {NestFactory, Reflector} from '@nestjs/core';
import { AppModule } from './app.module';
import {NestExpressApplication} from "@nestjs/platform-express";
import {AppConfigService} from "./config/app/config.service";
import SwaggerSetup from './swagger';
import {ValidationPipe} from "@nestjs/common";
import * as helmet from 'helmet';
import * as RateLimit from 'express-rate-limit';
import * as compression from 'compression';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(helmet());
  app.use(
      new RateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
      })
  );
  app.use(compression());
  app.use(morgan('combined'));
  app.enableCors();

  // Getting config
  const appConfig: AppConfigService = app.get('AppConfigService');

  app.useGlobalPipes(new ValidationPipe());

  if (appConfig.env === 'development') {
    SwaggerSetup(app);
  }
  await app.listen(appConfig.port);
  console.log(`App running on port: ${appConfig.port}`)
}
bootstrap();
