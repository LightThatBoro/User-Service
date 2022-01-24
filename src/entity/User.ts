import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { IUser } from '../types'

@Entity()
export default class implements IUser {

    @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
    id: number

    @Column({ nullable: false })
    type: 'user' | 'educator' | 'admin'

    @CreateDateColumn({ name: 'created_at', nullable: false })
    createdAt: Date
}
