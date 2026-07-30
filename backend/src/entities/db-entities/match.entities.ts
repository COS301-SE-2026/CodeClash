import { Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class MatchProblems{
    @PrimaryGeneratedColumn('uuid')
    match_problems_id!: string

    
}