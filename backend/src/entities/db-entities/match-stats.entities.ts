import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Users } from './user.entities';
import { Matches } from './match.entities';

@Entity()
export class MatchStats{
    @PrimaryGeneratedColumn('uuid')
    stat_id!: string;

    @ManyToOne(() => Matches)
    @JoinColumn({ name: 'match_id' })
    match!: Matches;

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