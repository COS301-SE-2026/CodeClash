import { DeepPartial } from "typeorm";
import { ProgrammingTemplates, TestCases } from "../../src/entities/database/questions.entities";
import { mock_questions } from "./mock-questions";
import { MatchMode } from "../../src/entities/dtos/matches/match.dto";


export const mock_templates: DeepPartial<ProgrammingTemplates>[] = [];

for (const q of mock_questions) {
    if (q.match_mode === MatchMode.Programming)
        mock_templates.push({
            question: q,
            language: 'cpp',
            judge0_language_id: 54,
            starter_code: 'mock starter code'
        })
}

export const mock_test_cases: DeepPartial<TestCases>[] = [];

for (const q of mock_questions) {

    if (q.match_mode === MatchMode.Programming)
        mock_test_cases.push({
            question: q,
            input: "test input",
            expected_output: 'test expected output',
        })
}