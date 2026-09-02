import { IGameCache } from "src/application/interfaces/cache/IGameCache";
import { GameMode, GameType } from "src/entities/db-entities/questions.entities";
import { MatchDTO, PlayerDTO, RoundDTO } from "src/interface-adapters/dtos/components.dto";

import { CreateGame } from "../systems/create-game";

import { GetAnswers } from "./answers.service";
import { GetDifficulty, GetQuestions, GetTotalTime } from "./questions.service";
import { IMatchRepository } from "src/application/interfaces/repositories/IMatchRepository";
import { IUserRepository } from "src/application/interfaces/repositories/IUserRepository";

export class GameService {
    constructor(
        private readonly createGame: CreateGame,
        private readonly getQuestions: GetQuestions,
        private readonly getDifficulty: GetDifficulty,
        private readonly getTotalTime: GetTotalTime,
        private readonly getAnswers: GetAnswers,
        private readonly game_cache: IGameCache,
        private readonly match_repo: IMatchRepository,
        private readonly user_repo: IUserRepository
    ) { }

    async execute(players: PlayerDTO[], game_mode: GameMode, league: string, game_type: GameType) {

        let avg_elo = 0;
        const usernames = await Promise.all(
            players.map(async (player) => {
                avg_elo += player.elo
                const user = await this.user_repo.getUserData(player.id, 'username');
                return user!.username!;
            })
        )

        const title = usernames.join(" vs ")
        const player_ids = players.map((player) => player.id);
        avg_elo /= players.length;

        // get questions
        const questions = await this.getQuestions.execute(league, avg_elo, game_mode);
        const difficulty = this.getDifficulty.execute(questions)
        const time = this.getTotalTime.execute(questions)

        if (!questions) throw new Error("Error fetching questions")

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

        // Match 

        const start = new Date();
        const match: MatchDTO = {
            title: title,
            status: 'active',
            game_mode: game_mode,
            match_type: game_type,
            difficulty: difficulty,
            winner: -1,
            start_time: start,
            end_time: new Date(start.getTime() + (time * 60 * 1000))
        }

        const match_entity = this.createGame.execute(players, match, [round], question_ids.length);

        this.game_cache.saveGame(match_entity, player_ids, question_ids);

        for (const answer of answers) {
            this.game_cache.saveAnswer(answer.question_id, answer.answer)
        }


        const ids = players.map((p) => p.id);
        const db_match_id = await this.match_repo.createMatch(ids, game_type, game_mode, start); //mode is math or programming


        return {
            match_enitity: match_entity,
            match_id: db_match_id,
            questions: questions,
            answers: answers
        }

    }
}