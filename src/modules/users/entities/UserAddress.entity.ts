import {BaseEntity, Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User.entity";
import {UserAddressDto} from "../dto/UserAddress.dto";

@Entity()
export class UserAddress extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public lat: string;

    @Column()
    public lng: string;

    @Column({
        nullable: true
    })
    public country: string;

    @Column({
        nullable: true
    })
    public city: string;

    @Column()
    public address: string;

    @OneToOne(
        type => User,
        user => user.address
    )
    public user: User;

    public get dto(): UserAddressDto {
        return new UserAddressDto(this);
    }
}