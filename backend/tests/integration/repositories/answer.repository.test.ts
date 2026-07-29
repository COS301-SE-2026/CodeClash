import { DataSource, Repository } from "typeorm";
import { Answers } from '../../../src/entities/db-entities/answers.entities'
import { AnswerRepository } from '../../../src/interface-adapters/repositories/answer.repository'
import { beforeAll, describe, expect, it } from "vitest";
import { Questions } from "../../../src/entities/db-entities/questions.entities";
import { createTestDataSource } from "./test-data-source";
import { mock_questions } from "./mocks/mock-questions";
import { mock_answers } from "./mocks/mock-answers";

let data_source: DataSource
let answer_entity: Repository<Answers>
let answer_repo: AnswerRepository
let questions: Questions[]
let answers: Answers[]



describe("Answer Repository Quesries", () => {

    beforeAll(async () => {
        data_source = await createTestDataSource();

        questions = await data_source.getRepository(Questions).save(mock_questions);
        answers = await data_source.getRepository(Answers).save(mock_answers)
        
        answer_entity = data_source.getRepository(Answers);
        answer_repo = new AnswerRepository(answer_entity)
    })


    it('Gets answers for a question in the databse', async()=>{
        const answers = await answer_repo.getAnswer(questions[0].question_id);

        expect(answers).not.toBeNull();
        expect(answers.question_id).toBe(questions[0].question_id)
    })
})