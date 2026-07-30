import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from './user.entities';

@Entity()
export class MatchProblems{
    @PrimaryGeneratedColumn('uuid')
    match_problems_id!: string

    
}

@Entity()
export class Match {
    @PrimaryGeneratedColumn('uuid')
    match_id!: string;

    @OneToOne(() => Users)
    @JoinColumn({ name: 'player1_id'})
    player1!: Users;

    @OneToOne(() => Users)
    @JoinColumn({ name: 'player2_id'})
    player2!: Users;

    @Column({ type: 'varchar', length: 10})
    match_type!: 'ranked' | 'casual';

    @Column({ type: 'timestamp', nullable: true })
    match_start!: Date | null;

    @Column({ default: 'waiting'})
    status!: 'waiting' | 'starting' | 'in_progress' | 'completed' | 'abandoned';
}

@Entity()
export class MatchLog {
    @PrimaryGeneratedColumn('uuid')
    log_id!: string;

    @OneToOne(() => Match)
    @JoinColumn({ name: 'match_id' })
    match!: Match;

    @OneToOne(() => Users)
    @JoinColumn({ name: 'winner_id' })
    winner!: Users;

    @OneToOne(() => Users)
    @JoinColumn({ name: 'loser_id' })
    loser!: Users;

    @Column( { nullable: true })
    elo_change!: number;
}