import { Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class elo_ratings{
    @PrimaryGeneratedColumn('uuid')
    elo_id!: string
    
}