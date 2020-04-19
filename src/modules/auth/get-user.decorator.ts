import {createParamDecorator,ExecutionContext} from "@nestjs/common";
import {User} from "../users/entities/User.entity";

export const GetUser = createParamDecorator( (data, context: ExecutionContext): User => {
    const user = context.switchToHttp().getRequest().user;
    return user;
});