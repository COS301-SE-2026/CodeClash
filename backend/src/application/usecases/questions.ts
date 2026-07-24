import { GameMode } from "src/entities/db-entities/questions.entities";
import { IQuestionRepository } from "../interfaces/repositories/IQuestionRepository";
import { leagueMapping } from "src/entities/league-mapping";
import { GameQuestionsDTO } from "src/entities/dtos/game-data.dto";

export class GetQuestions {
    constructor(
        private readonly question_repo: IQuestionRepository,
    ) { }

    async execute(league: string, avg_elo: number, game_mode: GameMode) {

        const mapping = leagueMapping(league, avg_elo);

        if (!mapping) throw new Error("League not found")

        const easy_count: number = Math.round(mapping.question_number * (mapping.easy.percentage!));
        const medium_count: number = Math.round(mapping.question_number * (mapping.medium.percentage!));
        const hard_count: number = Math.round(mapping.question_number * mapping.hard.percentage!);

        const easy_questions = await this.question_repo.getRandQuestions(easy_count, mapping.easy.difficulty, game_mode);
        const medium_questions = await this.question_repo.getRandQuestions(medium_count, mapping.medium.difficulty, game_mode);
        const hard_questions = await this.question_repo.getRandQuestions(hard_count, mapping.hard.difficulty, game_mode);



        return {
            easy: easy_questions,
            medium: medium_questions,
            hard: hard_questions
        }
    }
}

export class GetDifficulty {
    constructor() { }

    execute(questions: GameQuestionsDTO) {

        let difficulty = 0;
        let count = 0;

        for (const question of questions.easy) {
            difficulty += question.difficulty;
        }

        for (const question of questions.medium) {
            difficulty += question.difficulty;
        }

        for (const question of questions.hard) {
            difficulty += question.difficulty;
        }

        count += (questions.easy.length + questions.medium.length + questions.hard.length)

        difficulty /= count;

        return difficulty;
    }
}

export class GetTotalTime {
    constructor() { }

    execute(questions: GameQuestionsDTO){
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