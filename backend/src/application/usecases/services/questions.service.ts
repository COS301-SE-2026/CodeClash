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

        const easy_count: number = Math.round(mapping.question_number * (mapping.easy.percentage!));
        const medium_count: number = Math.round(mapping.question_number * (mapping.medium.percentage!));
        const hard_count: number = Math.round(mapping.question_number * mapping.hard.percentage!);

        const easy_questions = await this.question_repo.getRandQuestions(easy_count, mapping.easy.difficulty, match_mode);
        const medium_questions = await this.question_repo.getRandQuestions(medium_count, mapping.medium.difficulty, match_mode);
        const hard_questions = await this.question_repo.getRandQuestions(hard_count, mapping.hard.difficulty, match_mode);



        return {
            easy: easy_questions.map(q=>({...q, difficulty: "Easy"})),
            medium: medium_questions.map(q=>({...q, difficulty: "Medium"})),
            hard: hard_questions.map(q=>({...q, difficulty: "Hard"}))
        }
    }
}

export class GetTotalTime {

    execute(questions: MatchQuestionArrays){
        let time = 0;

        for(const question of questions.easy){
            time += Number(question.time_limit.split(":")[1]);  //minutes
        }

        for(const question of questions.medium){
            time += Number(question.time_limit.split(":")[1]);  //minutes
        }

        for(const question of questions.hard){
            time += Number(question.time_limit.split(":")[1]);  //minutes
        }

    return time;
    }
}