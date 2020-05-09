import {EntityRepository, Repository} from "typeorm";
import {User} from "../entities/User.entity";
import {BadRequestException, InternalServerErrorException} from "@nestjs/common";
import {ERRORS_CONSTANTS} from "../../../shared/constants/errors.constants";
import * as bcrypt from 'bcrypt';
import {UserDto} from "../dto/User.dto";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    public async addNewUser(user: User): Promise<User> {
        try {
            user.password = await this.hashUserPass(user.password);
            return await user.save();
        } catch (e) {
            throw new BadRequestException(ERRORS_CONSTANTS.DB[e.code]('User'))
        }
    }

    public async activateUserEmail(id: number): Promise<boolean> {
        const user = await this.findOneOrFail({where: {id}});
        if (!user) {
            return false;
        }

        user.emailActivated = true;

        try {
            await user.save();
            if (user.emailActivated) {
                return true;
            }
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }

    public async hashUserPass(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    public async updateProfile(user: User, userDto: UserDto): Promise<User> {
        return
    }
}

