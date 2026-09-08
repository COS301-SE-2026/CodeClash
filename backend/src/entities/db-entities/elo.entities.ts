import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn, UpdateDateColumn,CreateDateColumn } from "typeorm";
import { Users } from "./user.entities";
import { Matches } from "./match.entities";


@Entity()
export class EloRatings {
    @PrimaryGeneratedColumn('uuid')
    elo_id!: string

    @OneToOne(() => Users)
    @JoinColumn({name: 'user_id'})
    user!: Users

    @Column({ nullable: false })
    rating!: number

    @UpdateDateColumn()
    updated_at!: Date
}

@Entity()
export class EloHistory {
    @PrimaryGeneratedColumn('uuid')
    history_id!: string

    @ManyToOne(() => Users)
    user!: Users

    @ManyToOne(() => Matches)
    @JoinColumn({name: 'match_id'})
    match!: Matches;

    @Column()
    old_rating!: number

    @Column()
    new_rating!: number;

    @CreateDateColumn()
    changed_at!: Date;
}