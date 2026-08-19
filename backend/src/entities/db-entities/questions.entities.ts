import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum GameMode {
    Maths = "maths",
    Programming = "programming"
}

export enum GameType{
    ranked = 'ranked',
    casual = 'casual'
}


@Entity()
export class Questions {
    @PrimaryGeneratedColumn('uuid')
    question_id!: string

    @Column({
        nullable: false,
        type: "enum",
        enum: GameMode
    })
    game_mode!: GameMode

    @Column({ nullable: false })
    difficulty!: number

    @Column({ nullable: false, type: "text" })
    title!: string

    @Column({ nullable: false, type: "text" })
    description!: string

    @Column({ nullable: false, type: "time" })
    time_limit!: string
}