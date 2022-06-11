import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IUser } from "../types";

@Entity()
export class User implements IUser {
    @PrimaryGeneratedColumn("uuid")
    userId: string

    @Column()
    name: string

    @Column()
    phone: string

    @Column()
    address: string

    @Column()
    email: string

    @CreateDateColumn({ name: "created_at", nullable: false })
    createdAt: Date

    @UpdateDateColumn({ name: "updated_at", nullable: false })
    updatedAt: Date
}
