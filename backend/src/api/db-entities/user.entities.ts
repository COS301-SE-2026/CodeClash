import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User{
    @PrimaryGeneratedColumn('uuid')
    user_id!: string

    @Column()
    username!: string

    @Column()
    email!: string

    @Column()
    avatar_id!: number

    @Column()
    league!: string
}