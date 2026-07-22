import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User{
    @PrimaryGeneratedColumn('uuid')
    user_id!: string

    @Column({unique: true})
    cognito_id!: string

    @Column()
    username!: string

    @Column()
    email!: string

    @Column()
    avatar_id!: number

    @Column()
    league!: string

    @Column({default: 0})
    current_streak!: number

    @Column({default: 0})
    winning_streak!: number
}