import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from './user.entities';
import { Match } from "../ecs-entities";

@Entity()
export class MatchProblems{
    @PrimaryGeneratedColumn('uuid')
    match_problems_id!: string

    
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