import {Entity, Column, PrimaryGeneratedColumn, JoinTable, OneToMany, ManyToMany, OneToOne} from 'typeorm';
import { Exclude } from 'class-transformer';
import {MainEntity} from "../../../shared/database/Base.entity";
import {UserRole} from "./UserRole.entity";
import * as bcrypt from 'bcrypt';
import {UserAddress} from "./UserAddress.entity";
import {UserSpecialty} from "./UserSpecialty.entity";
import {UserDto} from "../dto/User.dto";

@Entity()
export class User extends MainEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: true
    })
    name: string;

    @Column({
        unique: true,
        nullable: true
    })
    email: string;

    @Column({
        unique: true
    })
    phone: string;

    @Column()
    @Exclude()
    password: string;

    @Column({
        default: false,
        type: 'boolean'
    })
    emailActivated: boolean;

    @Column({
        default: false,
        type: 'boolean'
    })
    phoneActivated: boolean;

    @Column({
        type: 'timestamp without time zone',
        nullable: true
    })
    birthday: Date;

    @Column({
        type: 'timestamp without time zone',
        nullable: true
    })
    lastActivity: Date;

    @Column({
        nullable: true
    })
    photo: string;

    @ManyToMany(
        type => UserSpecialty,
        speciality => speciality
    )
    @JoinTable({
        name: 'user_specialities'
    })
    specialities: UserSpecialty[];

    @OneToOne(
        type => UserAddress,
        address => address.user,
        {
            cascade: true,
            onDelete: 'CASCADE'
        }
    )
    address: UserAddress;

    @ManyToMany(
        type => UserRole,
        role => role.id,
        {
            eager: true,
            cascade: true
        }
    )
    @JoinTable({ name: 'user_roles' })
    roles: UserRole[];

    public async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }

    public get dto(): UserDto {
        const dto = new UserDto();
        dto.email = this.email;
        dto.phone = this.phone;
        dto.name = this.name;
        dto.address = this.address.dto;
        dto.birthday = this.birthday;

        return dto;
    }
}
