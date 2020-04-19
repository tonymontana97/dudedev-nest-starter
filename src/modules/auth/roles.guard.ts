import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Observable} from "rxjs";
import { Reflector } from '@nestjs/core';
import {User} from "../users/entities/User.entity";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly refactor: Reflector
    ) {
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.refactor.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        return this.correctRoles(user, roles);
    }

    private correctRoles(user: User, roles: string[]): boolean {
        return user.roles.filter((userRole) => roles.indexOf(userRole.name) >= 0).length === roles.length;
    }

}
