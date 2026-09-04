<<<<<<< HEAD:backend/tests/mocks/mock-answers.ts
import { DeepPartial } from "typeorm";
import { Answers } from "../../src/entities/db-entities/answers.entities";
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
=======
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
>>>>>>> 5378a30cd86c953bdc20aa94765d31b947e8a4e4:backend/tests/integration/repositories/mocks/mock-answers.ts
