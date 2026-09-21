import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { MatchMode, MatchPlayer, MatchPowerUps, MatchQuestion, MatchStatus, MatchType } from "../dtos/match/match.dto";

@Entity()
export class Matches {
    @PrimaryGeneratedColumn('uuid')
    match_id!: string;

    @Column({ type: "jsonb", nullable: true })
    players!: MatchPlayer[];

    @Column({ type: "jsonb", nullable: true })
    questions!: MatchQuestion[];

    @Column({ type: "jsonb", nullable: true })
    power_ups!: MatchPowerUps[];

    @Column({ type: 'varchar', length: 10 })
    match_type!: MatchType;

    @Column({ type: 'varchar', length: 15 })
    match_mode!: MatchMode;

    @Column({ type: 'timestamp', nullable: true })
    match_start!: Date | null;

    @Column({ type: "timestamp", nullable: true })
    match_end!: Date | null;

    @Column({ default: 'waiting' })
    status!: MatchStatus;
}
