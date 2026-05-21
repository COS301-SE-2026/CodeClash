import type { MatchDTO } from "src/types/question.dto";
import { mock_questions } from "./prog-questions.mock";


export const mock_match: MatchDTO = {
    id: '100',
    player_1: 'User 1',
    player_2: 'User 2',
    duration: 5,
    questions: mock_questions
}