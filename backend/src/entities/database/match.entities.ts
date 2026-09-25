import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { MatchMode, MatchPlayer, MatchPowerUps, MatchQuestion, MatchStatus, MatchType } from "../dtos/matches/match.dto";

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

    @Column({ type: 'enum', enumName: 'MATCH_TYPES', enum: MatchType})
    match_type!: MatchType;

    @Column({ type: 'enum', enumName: 'MATCH_MODES', enum: MatchMode })
    match_mode!: MatchMode;

    @Column({ type: 'timestamp', nullable: true })
    match_start!: Date | null;

    @Column({ type: "timestamp", nullable: true })
    match_end!: Date | null;

    @Column({  type: 'enum', enumName: 'MATCH_STATUS', enum: MatchStatus, default: 'waiting' })
    status!: MatchStatus;
}
