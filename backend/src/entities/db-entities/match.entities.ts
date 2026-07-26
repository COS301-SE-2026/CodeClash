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
    match!: string;

    @OneToOne(() => Users)
    @JoinColumn({ name: 'player1_id'})
    player1!: Users;

    @OneToOne(() => Users)
    @JoinColumn({ name: 'player2_id'})
    player2!: Users;

    @OneToOne(() => MatchProblems, { nullable: true})
    @JoinColumn({ name: 'match_problems' })
    match_problems!: MatchProblems | null;

    @Column({ type: 'varchar', length: 10})
    mode!: 'ranked' | 'casual';

    @CreateDateColumn()
    queue_start!: Date;

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
    elo_gained!: number | null;

    @Column( { nullable: true })
    elo_lost!: number | null;
}