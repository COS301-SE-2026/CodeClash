import { DeepPartial } from "typeorm";
import { GameMode, Questions } from "../../../../src/entities/db-entities/questions.entities";


export const mock_questions: DeepPartial<Questions>[] = [
    {
        game_mode: GameMode.Maths,
        difficulty: 4,
        title: 'Question 1',
        description: "Answer repo testing, question 1",
        time_limit: '00:02:02'

    },
    {
        game_mode: GameMode.Maths,
        difficulty: 3,
        title: 'Question 2',
        description: "Answer repo testing, question 2",
        time_limit: '00:02:02'

    },
    {
        game_mode: GameMode.Maths,
        difficulty: 4,
        title: 'Question 3',
        description: "Answer repo testing, question 3",
        time_limit: '00:02:02'

    }
]