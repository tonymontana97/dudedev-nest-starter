import {HttpService, Injectable} from '@nestjs/common';
import {RetsClient, RetsFormat, RetsVersion} from 'rets-ddf-client';
import {AppConfigService} from "../../config/app/config.service";

const baseUrl = 'http://rets.perchwell.com:6103';

const endpoints = {
    login: baseUrl + '/login'
};

@Injectable()
export class PerchwellService {
    private client;

    constructor(
        private readonly httpService: HttpService,
        private readonly appConfigService: AppConfigService
    ){
        this.client = new RetsClient({
            url: endpoints.login,
            username: this.appConfigService.perchwellUsername,
            password: this.appConfigService.perchwellPassword,
            version: RetsVersion.CREA_DDF
        });
        this.auth();
    }

    private async auth(): Promise<void> {
        await this.client.login();
    }

    public search(query: string): Promise<Object> {
        return this.client.search({
            format: RetsFormat.StandardXml,
            query,
        });
    }
}
