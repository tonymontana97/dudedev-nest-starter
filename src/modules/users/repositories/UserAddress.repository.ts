import {EntityRepository, Repository} from "typeorm";
import {UserAddress} from "../entities/UserAddress.entity";
import {UserAddressDto} from "../dto/UserAddress.dto";
import {User} from "../entities/User.entity";

@EntityRepository(UserAddress)
export class UserAddressRepository extends Repository<UserAddress>{
    public async updateUserAddress(userAddressDto: UserAddressDto, user: User): Promise<UserAddress> {
        const {lat, lng, address} = userAddressDto;

        if (user.address.address !== address) {
            user.address.lat = lat;
            user.address.lng = lng;
            user.address.address = address;
        }

        return user.address;
    }
}