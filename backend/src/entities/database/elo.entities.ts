import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Users } from "./user.entities";
import { Matches } from "./match.entities";

@Entity()
export class EloHistory {
    @PrimaryGeneratedColumn('uuid')
    history_id!: string

    @ManyToOne(() => Users)
    @JoinColumn({ name: 'user_id' })
    user!: Users

    @ManyToOne(() => Matches)
    @JoinColumn({ name: 'match_id' })
    match!: Matches;

    @Column()
    new_rating!: number;

    @CreateDateColumn()
    changed_at!: Date;
}