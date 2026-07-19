import { Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Match_Problems{
    @PrimaryGeneratedColumn('uuid')
    match_problems_id!: string

    
}