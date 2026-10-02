import { MatchMode, MatchQuestionArrays } from "src/entities/dtos/matches/match.dto";
import { leagueMapping } from "src/entities/league-mapping";

import { IQuestionRepository } from "../../interfaces/repositories/IQuestionRepository";
import { timeLimitMs } from "./skill/question-results";


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
          easy: easy_questions.map(q=>({...q, difficulty_level: Number(q.difficulty), difficulty: "Easy"})),
          medium: medium_questions.map(q=>({...q, difficulty_level: Number(q.difficulty), difficulty: "Medium"})),
          hard: hard_questions.map(q=>({...q, difficulty_level: Number(q.difficulty), difficulty: "Hard"}))
        }
    }
}

export class GetTotalTime {

    // Total match time in minutes (may be fractional); time_limit is a postgres TIME (HH:MM:SS)
    execute(questions: MatchQuestionArrays) {
        const all = [...questions.easy, ...questions.medium, ...questions.hard];
        const total_ms = all.reduce((sum, question) => sum + timeLimitMs(question.time_limit), 0);

        return total_ms / 60000;
    }
}