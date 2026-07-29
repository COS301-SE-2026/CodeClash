import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn, CreateDateColum } from "typeorm";
import { Users } from "./user.entities";
import { Match } from "./match.entities";


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

    @ManyToOne(() => Match)
    @JoinColumn({name: 'match_id'})
    match!: Match;

    @Column()
    old_rating!: number

    @Column()
    new_rating!: number;

    @CreateDateColumn()
    changed_at!: Date;
}