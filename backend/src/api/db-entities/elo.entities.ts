import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { User } from "./user.entities";


@Entity()
export class Elo_ratings {
    @PrimaryGeneratedColumn('uuid')
    elo_id!: string

    @OneToOne(() => User)
    @JoinColumn()
    user!: User

    @Column()
    rating!: number
}

@Entity()
export class Elo_history{
    @PrimaryGeneratedColumn('uuid')
    history_id!: string

    @ManyToOne(()=> User)
    user!: User

}