import {Injectable} from "@nestjs/common";
import {UserRoleRepository} from "../repositories/userRole.repository";
import {UserRole} from "../entities/UserRole.entity";
import {Role} from "../types/Role.enum";

@Injectable()
export class UserRolesService {
    constructor(
        private readonly userRoleRepository: UserRoleRepository
    ) {
    }

    public async getDefaultUserRole(): Promise<UserRole> {
        const defaultRole = await this.userRoleRepository.findOne({ name: Role.USER });
        if (defaultRole) {
            return defaultRole;
        } else {
            return this.addDefaultUserRole();
        }
    }

    private async addDefaultUserRole(): Promise<UserRole> {
        const role = new UserRole();
        role.name = Role.USER;
        return this.userRoleRepository.addRole(role);
    }
}