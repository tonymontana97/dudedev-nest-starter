import { Injectable } from '@nestjs/common';

@Injectable()
export class SmsAdapterService {

    public get codeActivation(): string {
        return '0000';
    }
}
