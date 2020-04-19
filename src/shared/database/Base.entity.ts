import {BaseEntity, CreateDateColumn, UpdateDateColumn} from 'typeorm';

export abstract class MainEntity extends BaseEntity {
    @CreateDateColumn({
        type: 'timestamp without time zone',
        name: 'created_at',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp without time zone',
        name: 'updated_at',
    })
    updatedAt: Date;
}
