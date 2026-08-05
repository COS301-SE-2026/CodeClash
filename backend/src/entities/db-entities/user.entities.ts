import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Users {
    @PrimaryGeneratedColumn('uuid')
    user_id!: string

    @Column({ unique: true })
    cognito_id!: string

    @Column({ nullable: false })
    username!: string

    @Column({ nullable: false })
    email!: string

    @Column({ nullable: false })
    avatar_id!: number

    @Column({ nullable: false })
    league!: string

    @Column({
        default: 0,
        nullable: false
    })
    current_streak!: number

    @Column({
        default: 0,
        nullable: false
    })
    winning_streak!: number
}