import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { MatchMode } from "../dtos/match/match.dto";
import { AnswerFormat } from "../dtos/match/answer.dto";
import { QuestionInputType } from "../dtos/match/question.dto";


@Entity()
export class Questions {
  @PrimaryGeneratedColumn('uuid')
  question_id!: string

  @Column({
    nullable: false,
    type: "enum",
    enum: MatchMode,
    enumName: "MATCH_MODES"
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
  answer_precision!: number | null

  @Column({
    type: 'enum',
    enum: QuestionInputType,
    enumName: "question_input_types",
    nullable: false
  })
  input_type!: QuestionInputType
}
