import { DataSource, Repository } from "typeorm";
import { Questions } from "../../../src/entities/database/questions.entities";
import { QuestionRepository } from '../../../src/interface-adapters/repositories/question.repository'
import { beforeAll, describe, expect, it } from "vitest";
import { createTestDataSource } from "../../test-data-source";
import { mock_questions } from "../../mocks/mock-questions";
import { MatchMode } from "../../../src/entities/dtos/matches/match.dto";

let data_source: DataSource
let question_entity: Repository<Questions>
let question_repo: QuestionRepository
let questions: Questions[];


describe("Question Repository Queries", () => {
    beforeAll(async () => {
        data_source = await createTestDataSource();

        questions = await data_source.getRepository(Questions).save(mock_questions);
        question_entity = data_source.getRepository(Questions);
        question_repo = new QuestionRepository(question_entity)
    })


    it("gets random questions from the database", async () => {

        const fetched = await question_repo.getRandQuestions(3, 4, MatchMode.Maths);

        expect(fetched).toHaveLength(3);
        expect(fetched.every(q =>
            q.match_mode === MatchMode.Maths &&
            q.difficulty === 4
        )).toBe(true);
    })
})