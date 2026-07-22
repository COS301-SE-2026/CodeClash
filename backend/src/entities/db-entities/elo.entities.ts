import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { Users } from "./user.entities";


@Entity()
export class Elo_ratings {
    @PrimaryGeneratedColumn('uuid')
    elo_id!: string

    @OneToOne(() => Users)
    @JoinColumn()
    user!: Users

    @Column({ nullable: false })
    rating!: number
}

@Entity()
export class Elo_history {
    @PrimaryGeneratedColumn('uuid')
    history_id!: string

    @ManyToOne(() => Users)
    user!: Users

}