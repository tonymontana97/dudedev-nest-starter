import { Module } from '@nestjs/common';
import { SmsAdapterService } from './sms-adapter.service';

@Module({
  providers: [SmsAdapterService],
  exports: [
      SmsAdapterService
  ]
})
export class SmsAdapterModule {}
