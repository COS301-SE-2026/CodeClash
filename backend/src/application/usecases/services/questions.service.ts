import { MatchMode, MatchQuestionArrays } from "src/entities/dtos/matches/match.dto";
import { leagueMapping } from "src/entities/league-mapping";

import { IQuestionRepository } from "../../interfaces/repositories/IQuestionRepository";


export class GetQuestions {
    constructor(
        private readonly question_repo: IQuestionRepository,
    ) { }

    async execute(league: string, avg_elo: number, match_mode: MatchMode) {

        const mapping = leagueMapping(league, avg_elo);

        if (!mapping) throw new Error("League not found")

        const easy_count: number = Math.max(3, Math.round(mapping.question_number * (mapping.easy.percentage!)));
        const medium_count: number = Math.max(3, Math.round(mapping.question_number * (mapping.medium.percentage!)));
        const hard_count: number = Math.max(3, Math.round(mapping.question_number * (mapping.hard.percentage!)));



        const easy_questions = await this.question_repo.getRandQuestions(Math.max(2,easy_count), mapping.easy.difficulty, match_mode);
        const medium_questions = await this.question_repo.getRandQuestions(Math.max(2,medium_count), mapping.medium.difficulty, match_mode);
        const hard_questions = await this.question_repo.getRandQuestions(Math.max(2,hard_count), mapping.hard.difficulty, match_mode);


    
        return {
            easy: easy_questions.map(q => ({ ...q, difficulty: "Easy" })),
            medium: medium_questions.map(q => ({ ...q, difficulty: "Medium" })),
            hard: hard_questions.map(q => ({ ...q, difficulty: "Hard" }))
        }
    }
}

// time_limit is a postgres TIME (HH:MM:SS)
const timeLimitMs = (time_limit: string): number => {
    const [hours = 0, minutes = 0, seconds = 0] = time_limit.split(':').map(Number);
    return ((hours * 60 + minutes) * 60 + seconds) * 1000;
};

export class GetTotalTime {

    // Total match time in minutes (may be fractional)
    execute(questions: MatchQuestionArrays) {
        const all = [...questions.easy, ...questions.medium, ...questions.hard];
        const total_ms = all.reduce((sum, question) => sum + timeLimitMs(question.time_limit), 0);

        return total_ms / 60000;
    }
}