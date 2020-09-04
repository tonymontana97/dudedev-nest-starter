/**
 * Service dealing with app config based operations.
 *
 * @class
 */
import {ConfigService} from "@nestjs/config";
import {Injectable} from "@nestjs/common";

@Injectable()
export class AppConfigService {
    constructor(private configService: ConfigService) {}

    get name(): string {
        return this.configService.get<string>('app.name');
    }
    get env(): string {
        return this.configService.get<string>('app.env');
    }
    get url(): string {
        return this.configService.get<string>('app.url');
    }
    get domain(): string {
        return this.configService.get<string>('app.domain');
    }
    get port(): number {
        return Number(this.configService.get<number>('app.port'));
    }
    get jwtSecret(): string {
        return this.configService.get<string>('app.jwtSecret');
    }
    get jwtExpiresIn(): string {
        return this.configService.get('app.jwtExpiresIn')
    }
    get perchwellUsername(): string {
        return this.configService.get('app.perchwellUsername')
    }
    get perchwellPassword(): string {
        return this.configService.get('app.perchwellPassword')
    }
}
