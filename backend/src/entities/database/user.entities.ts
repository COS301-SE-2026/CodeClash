import { Column, Entity, JoinColumn, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Achievement } from "./achievement.entities";

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

    @Column({ nullable: false, default: 600 })
    elo!: number

    @Column({ nullable: false })
    avatar_id!: number

    @Column({ nullable: false, default: "Mercury" })
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

    @ManyToMany(() => Achievement, achievement => achievement.users)
    @JoinTable({
        name: 'player_achievements',
        joinColumn: {name: 'user_id', referencedColumnName: 'user_id'},
        inverseJoinColumn: {name: 'achievement_id', referencedColumnName: 'achievement_id'}
    })
    achievements!: Achievement[];

    @Column({ nullable: true, type: 'timestamp' })
    last_played_at?: Date;
}