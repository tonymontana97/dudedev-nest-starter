import {Entity, Column, PrimaryGeneratedColumn, JoinTable, OneToMany, ManyToMany} from 'typeorm';
import { Exclude } from 'class-transformer';
import {MainEntity} from "../../../shared/database/Base.entity";
import {UserRole} from "./UserRole.entity";
import * as bcrypt from 'bcrypt';

@Entity()
export class User extends MainEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({
        unique: true
    })
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column({
        default: false,
        type: 'boolean'
    })
    emailActivated: boolean;

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
        type => UserRole,
        role => role.id,
        {
            eager: true
        }
    )
    @JoinTable({ name: 'user_roles' })
    roles: UserRole[];

    public async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}
