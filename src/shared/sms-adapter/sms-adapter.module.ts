import { Module } from '@nestjs/common';
import { SmsAdapterService } from './sms-adapter.service';

@Module({
  providers: [SmsAdapterService]
})
export class SmsAdapterModule {}
