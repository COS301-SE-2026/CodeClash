import { IGameCache } from "src/application/interfaces/IGameCache";
import { GameMode } from "src/entities/db-entities/questions.entities";
import { MatchDTO, PlayerDTO, RoundDTO } from "src/entities/dtos/components.dto";

import { CreateGame } from "../systems/create-game";

import { GetAnswers } from "./answers.service";
import { GetDifficulty, GetQuestions, GetTotalTime } from "./questions.service";


export class GameService {
    constructor(
        private readonly createGame: CreateGame,
        private readonly getQuestions: GetQuestions,
        private readonly getDifficulty: GetDifficulty,
        private readonly getTotalTime: GetTotalTime,
        private readonly getAnswers: GetAnswers,
        private readonly game_cache: IGameCache
    ) { }

    async execute(players: PlayerDTO[], game_mode: GameMode, league: string) {


        const title_temp: string[] = []
        let avg_elo = 0;
        const player_ids: string[] = []

        for (const player of players) {
            title_temp.push(player.username);
            player_ids.push(player.id);
            avg_elo += player.elo
        }

        avg_elo /= players.length;

        // get questions
        const questions = await this.getQuestions.execute(league, avg_elo, game_mode);
        const difficulty = this.getDifficulty.execute(questions)
        const time = this.getTotalTime.execute(questions)

        if(!questions) throw new Error ("Error fetching questions")

        // Rounds   - creating one round for now, this logic will need to be updated for multiple 
        const question_ids: string[] = [];
        for (const question of questions.easy) {
            question_ids.push(question.id)
        }
        for (const question of questions.medium) {
            question_ids.push(question.id)
        }
        for (const question of questions.hard) {
            question_ids.push(question.id)
        }

        // need to update for multiple round
        const round: RoundDTO = { question_ids: question_ids }

        // get answers 
        const answers = await this.getAnswers.execute(question_ids)
        console.log("LINE 58 Game Service, get answers: ", answers)

        // Match 

        const start = new Date();
        const match: MatchDTO = {
            title: title_temp.join(" vs "),
            status: 'active',
            game_mode: game_mode,
            difficulty: difficulty,
            winner: -1,
            start_time: start,
            end_time: new Date(start.getTime() + (time * 60 * 1000))
        }

        const match_entity = this.createGame.execute(players, match, [round], question_ids.length);

        this.game_cache.saveGame(match_entity, player_ids, question_ids);

        for (const answer of answers) {
            console.log("Saving game answers to the cache")
            this.game_cache.saveAnswer(answer.question_id, answer.answer)
        }

        return {
            id: match_entity,
            questions: questions,
            answers: answers
        }

    }
}