import { DeepPartial } from "typeorm";
import { Answers } from "../../../../src/entities/db-entities/answers.entities";
import { mock_questions } from "./mock-questions";


const question = mock_questions;

const mock_answers: DeepPartial<Answers>[]= []

for (const q of question) {
    mock_answers.push({
        question: q,
        answer: `Answer ${q.title}`
    })
}

export { mock_answers }
