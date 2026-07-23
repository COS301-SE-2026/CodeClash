import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { Users } from "./user.entities";


@Entity()
export class EloRatings {
    @PrimaryGeneratedColumn('uuid')
    elo_id!: string

    @OneToOne(() => Users)
    @JoinColumn({name: 'user_id'})
    user!: Users

    @Column({ nullable: false })
    rating!: number
}

@Entity()
export class EloHistory {
    @PrimaryGeneratedColumn('uuid')
    history_id!: string

    @ManyToOne(() => Users)
    user!: Users

}