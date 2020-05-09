import {EntityRepository, Repository} from "typeorm";
import {UserSpecialty} from "../entities/UserSpecialty.entity";

@EntityRepository(UserSpecialty)
export class UserSpecialityRepository extends Repository<UserSpecialty> {

}