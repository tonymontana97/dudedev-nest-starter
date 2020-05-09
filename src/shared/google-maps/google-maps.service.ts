import { Injectable } from '@nestjs/common';
import {UserAddressDto} from "../../modules/users/dto/UserAddress.dto";
import {UserAddress} from "../../modules/users/entities/UserAddress.entity";
import {Client} from '@googlemaps/google-maps-services-js';
import {AddressComponent} from "@googlemaps/google-maps-services-js/dist/common";
import {ConfigService} from "@nestjs/config";
import {AppConfigService} from "../../config/app/config.service";

@Injectable()
export class GoogleMapsService {
    private readonly client: Client;

    constructor(
        private readonly appConfigService: AppConfigService
    ) {
        this.client = new Client();
    }

    /**
     * TODO: Add google maps decoder
     * Getting user address entity from dto
     * @param userAddressDto
     */
    public async getUserAddress(userAddressDto: UserAddressDto): Promise<UserAddress> {
        const {lat, lng, address} = userAddressDto;

        const userAddress = new UserAddress();
        userAddress.address = address;
        userAddress.lat = lat;
        userAddress.lng = lng;

        return userAddress;
    }

    public getCityFromComponents(components: AddressComponent[]): string {
        const component = components.find((c) => c.types.findIndex(t => t === 'locality') >= 0);

        if (component) {
            return component.long_name;
        }

        return null;
    }

    public getCountryFromComponents(components: AddressComponent[]): string {
        const component = components.find((c) => c.types.findIndex(t => t === 'country') >= 0);

        if (component) {
            return component.long_name;
        }

        return null;
    }
}
