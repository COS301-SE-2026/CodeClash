import { DataSource, Repository } from "typeorm";
import { Answers } from '../../../src/entities/db-entities/answers.entities'
import { AnswerRepository } from '../../../src/interface-adapters/repositories/answer.repository'
import { beforeAll, describe, expect, it } from "vitest";
import { Questions } from "../../../src/entities/db-entities/questions.entities";
import { createTestDataSource } from "./test-data-source";
import { mock_questions } from "./mocks/mock-questions";
import { mock_answers } from "./mocks/mock-answers";
import { randomUUID } from "node:crypto";

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


    it('Gets answers for a question in the databse', async () => {
        const answers = await answer_repo.getAnswer(questions[0].question_id);

        expect(answers).not.toBeNull();
        expect(answers.question_id).toBe(questions[0].question_id)
    })


    it("Gets answers for an array of questions", async () => {

        const ids = questions.map(q => q.question_id);
        const fetched_answers = await answer_repo.getAnswers(ids);

        expect(fetched_answers.map(fa => fa.answer).sort()).toEqual(answers.map(a => a.answer).sort());
    })

    it("Skips questions that aren't in the repo", async () => {
        const rand_id = randomUUID();
        const ids = [questions[0].question_id, rand_id];

        const answers = await answer_repo.getAnswers(ids);

        expect(answers).toHaveLength(1);
        expect(answers[0].question_id).toBe(questions[0].question_id)
    })

    it("Returns null for an undefined question", async()=>{
        const no_question = randomUUID();

        const fetched_none = await answer_repo.getAnswer(no_question);
        expect(fetched_none).toBeNull()
    })
})