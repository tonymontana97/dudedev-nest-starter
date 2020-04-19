import {EntityRepository, Repository} from "typeorm";
import {UserRole} from "../entities/UserRole.entity";
import {BadRequestException} from "@nestjs/common";
import {ERRORS_CONSTANTS} from "../../../shared/constants/errors.constants";

@EntityRepository(UserRole)
export class UserRoleRepository extends Repository<UserRole> {
    public async addRole(role: UserRole): Promise<UserRole> {
        try {
            return await role.save();
        } catch (e) {
            throw new BadRequestException(ERRORS_CONSTANTS.DB[e.code]('Role'));
        }
    }
}