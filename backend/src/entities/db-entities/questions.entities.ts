import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum GameMode {
    Maths = "math",
    Programming = "programming"
}

export enum GameType{
    ranked = 'ranked',
    casual = 'casual'
}

export enum AnswerFormat {
  Numeric = "numeric",
  Decimal = "decimal",
  Set = "set",
  Variables = "variables",
  Expression = "expression",
  Simplified = "simplified",
  Factored = "factored",
  Equation = "equation"
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

    @Column({ nullable: true, type: "enum", enum: AnswerFormat })
    answer_format!: AnswerFormat | null // for prog matches, a prog match wouldnt like, need a numerical answer format requirement
  
    @Column({ nullable: true, type: "integer" })
    answer_precision!: number | null }
