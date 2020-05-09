import {MainEntity} from "../../../shared/database/Base.entity";
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class UserSpecialty extends MainEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;
}