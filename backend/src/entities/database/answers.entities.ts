import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { Questions } from "./questions.entities";




@Entity()
export class Answers {
    @PrimaryGeneratedColumn('uuid')
    answer_id!: string

    @OneToOne(() => Questions)
    @JoinColumn({ name: 'question_id' })
    question!: Questions

    @Column({ nullable: false, type:'text' })
    answer!: string


}