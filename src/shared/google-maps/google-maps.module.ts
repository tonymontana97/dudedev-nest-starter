import { Module } from '@nestjs/common';
import { GoogleMapsService } from './google-maps.service';
import {AppConfigModule} from "../../config/app/config.module";
import {AppConfigService} from "../../config/app/config.service";

@Module({
  imports: [
      AppConfigModule
  ],
  providers: [
    GoogleMapsService,
    AppConfigService
  ],
  exports: [
      GoogleMapsService
  ]
})
export class GoogleMapsModule {}
