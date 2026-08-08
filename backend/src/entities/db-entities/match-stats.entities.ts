import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Users } from './user.entities';
import { Match } from './match.entities';

@Entity()
export class MatchStats{
    @PrimaryGeneratedColumn('uuid')
    stat_id!: string;

    @ManyToOne(() => Match)
    @JoinColumn({ name: 'match_id' })
    match!: Match;

    @ManyToOne(() => Users)
    @JoinColumn({ name: 'user_id' })
    user!: Users;

    @Column()
    num_correct!: number;

    @Column()
    total_time!: number;

    @CreateDateColumn()
    created_at!: Date;
}