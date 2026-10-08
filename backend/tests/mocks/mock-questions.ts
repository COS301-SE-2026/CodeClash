import { DeepPartial } from "typeorm";
import { Questions } from "../../src/entities/database/questions.entities";
import { MatchMode } from "../../src/entities/dtos/matches/match.dto";
import { QuestionInputType } from "../../src/entities/dtos/questions/question.dto";


export const mock_questions: DeepPartial<Questions>[] = []

// add maths Mercury

for (let i = 0; i < 20; i++) {
    mock_questions.push({
        match_mode: MatchMode.Maths,
        difficulty: (i % 3) + 1,
        title: `Question ${i + 1}`,
        description: `Answer repo testing, question ${i + 1}`,
        time_limit: '00:02:02',
        input_type: QuestionInputType.short_text

    })
}

// maths Venus
for (let i = 0; i < 20; i++) {
    mock_questions.push({
        match_mode: MatchMode.Maths,
        difficulty: (i % 3) + 4,
        title: `Question ${(i + 21) + 1}`,
        description: `Answer repo testing, question ${i + 1}`,
        time_limit: '00:02:02',
        input_type: QuestionInputType.short_text

    })
}

// add programming Mercury
for (let i = 0; i < 20; i++) {
    mock_questions.push({
        match_mode: MatchMode.Programming,
        difficulty: (i % 3) + 1,
        title: `Question ${(i + 41) + 1}`,
        description: `Answer repo testing, question ${i + 1}`,
        time_limit: '00:02:02',
        input_type: QuestionInputType.short_text

    })
}

// add programming Venus
for (let i = 0; i < 20; i++) {
    mock_questions.push({
        match_mode: MatchMode.Programming,
        difficulty: (i % 3) + 4,
        title: `Question ${(i + 41) + 1}`,
        description: `Answer repo testing, question ${i + 1}`,
        time_limit: '00:02:02',
        input_type: QuestionInputType.short_text

    })
}