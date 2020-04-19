import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from "passport-jwt";
import {ExtractJwt} from "passport-jwt";
import {IJwtPayload} from "./types/jwtPayload.interface";
import {User} from "../users/entities/User.entity";
import {UsersService} from "../users/services/users.service";
import {AppConfigService} from "../../config/app/config.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly usersService: UsersService,
        private readonly appConfigService: AppConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: appConfigService.jwtSecret,
        });
    }

    async validate(payload: IJwtPayload): Promise<User> {
        const {email} = payload;
        const user = await this.usersService.getByEmail(email);
        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}