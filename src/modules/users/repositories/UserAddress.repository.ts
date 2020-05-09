import {EntityRepository, Repository} from "typeorm";
import {UserAddress} from "../entities/UserAddress.entity";

@EntityRepository(UserAddress)
export class UserAddressRepository extends Repository<UserAddress>{

}