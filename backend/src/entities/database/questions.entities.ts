import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { MatchMode } from "../dtos/match/match.dto";
import { AnswerFormat } from "../dtos/match/answer.dto";


@Entity()
export class Questions {
    @PrimaryGeneratedColumn('uuid')
    question_id!: string

    @Column({
        nullable: false,
        type: "enum",
      enum: MatchMode,
        enumName: "match_modes"
    })
    match_mode!: MatchMode

    @Column({ nullable: false })
    difficulty!: number

    @Column({ nullable: false, type: "text" })
    title!: string

    @Column({ nullable: false, type: "text" })
    description!: string

    @Column({ nullable: false, type: "time" })
    time_limit!: string

    @Column({ nullable: true, type: "enum", enum: AnswerFormat, enumName: "answer_formats" })
    answer_format!: AnswerFormat | null // for prog matches, a prog match wouldnt like, need a numerical answer format requirement
  
    @Column({ nullable: true, type: "integer" })
    answer_precision!: number | null }
