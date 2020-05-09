import { Injectable } from '@nestjs/common';
import {UserAddressDto} from "../../modules/users/dto/UserAddress.dto";
import {UserAddress} from "../../modules/users/entities/UserAddress.entity";
import {Client} from '@googlemaps/google-maps-services-js';
import {AddressComponent} from "@googlemaps/google-maps-services-js/dist/common";

@Injectable()
export class GoogleMapsService {
    private readonly client: Client;

    constructor() {
        this.client = new Client();
    }

    public async getUserAddress(userAddressDto: UserAddressDto): Promise<UserAddress> {
        const {lat, lng, address} = userAddressDto;
        const addressComponents = await this.client.reverseGeocode({
            params: {
                place_id: 'ChIJsfWg8ZnnOkcRTpCkWOgD8fg',
                key: 'AIzaSyChXQ-Gvky8X_pZLjc4W_RCxkTcLTPdoU8'
            }
        });
        const userAddress = new UserAddress();
        userAddress.address = address;
        userAddress.lat = lat;
        userAddress.lng = lng;

        if (addressComponents.data && addressComponents.data.results.length > 0) {
            userAddress.country = this.getCountryFromComponents(addressComponents.data.results[0].address_components);
            userAddress.city = this.getCityFromComponents(addressComponents.data.results[0].address_components);
        }

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
