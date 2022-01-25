import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IUser } from "../types";

@Entity()
export class User implements IUser {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ nullable: false })
    type: "user" | "educator" | "admin"

    @CreateDateColumn({ name: "created_at", nullable: false })
    createdAt: Date
}
