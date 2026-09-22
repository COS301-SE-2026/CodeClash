import { DeepPartial } from "typeorm";
import { Questions } from "../../src/entities/database/questions.entities";
import { MatchMode } from "../../src/entities/dtos/match/match.dto";
import { QuestionInputType } from "../../src/entities/dtos/match/question.dto";


export const mock_questions: DeepPartial<Questions>[] = [
    {
        match_mode: MatchMode.Maths,
        difficulty: 4,
        title: 'Question 1',
        description: "Answer repo testing, question 1",
        time_limit: '00:02:02',
        input_type: QuestionInputType.short_text

    },
    {
        match_mode: MatchMode.Maths,
        difficulty: 3,
        title: 'Question 2',
        description: "Answer repo testing, question 2",
        time_limit: '00:02:02',
        input_type: QuestionInputType.short_text

    },
    {
        match_mode: MatchMode.Maths,
        difficulty: 4,
        title: 'Question 3',
        description: "Answer repo testing, question 3",
        time_limit: '00:02:02',
        input_type: QuestionInputType.short_text

    },
    {
        match_mode: MatchMode.Programming,
        difficulty: 1,
        title: 'Question 4',
        description: "Answer repo testing, question 4",
        time_limit: '00:02:02',
         input_type: QuestionInputType.code

    }, {
        match_mode: MatchMode.Programming,
        difficulty: 2,
        title: 'Question 5',
        description: "Answer repo testing, question 5",
        time_limit: '00:02:02',
         input_type: QuestionInputType.code

    }, {
        match_mode: MatchMode.Programming,
        difficulty: 4,
        title: 'Question 6',
        description: "Answer repo testing, question 6",
        time_limit: '00:02:02',
         input_type: QuestionInputType.code

    },

]