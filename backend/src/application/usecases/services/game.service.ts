import { GameMode } from "src/entities/db-entities/questions.entities";
import { CreateGame } from "../systems/create-game";
import { MatchDTO, PlayerDTO, RoundDTO } from "src/entities/dtos/components.dto";
import { GetDifficulty, GetQuestions, GetTotalTime } from "./questions.service";
import { GetAnswers } from "./answers.service";
import { IGameCache } from "src/application/interfaces/IGameCache";
import { IMatchRepository } from "src/application/interfaces/repositories/IMatchRepository";

export class GameService {
    constructor(
        private readonly createGame: CreateGame,
        private readonly getQuestions: GetQuestions,
        private readonly getDifficulty: GetDifficulty,
        private readonly getTotalTime: GetTotalTime,
        private readonly getAnswers: GetAnswers,
        private readonly game_cache: IGameCache,
        private readonly match_repo: IMatchRepository
    ) { }

    async execute(players: PlayerDTO[], game_mode: GameMode, league: string) {


        let title_temp: string[] = []
        let avg_elo = 0;
        let player_ids: string[] = []

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
        let question_ids: string[] = [];
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
            title: title_temp.join(" vs "),
            status: 'active',
            game_mode: game_mode,
            difficulty: difficulty,
            winner: -1,
            start_time: start,
            end_time: new Date(start.getTime() + (time * 60 * 1000))
        }

        const match_entity = this.createGame.execute(players, match, [round], question_ids.length);

        const player1_id = players[0]?.id;
        const player2_id = players[1]?.id;

        if (!player1_id || !player2_id) throw new Error ("Both players must be defined to create a match");

        const db_match_id = await this.match_repo.createMatch(
            player1_id,
            player2_id,
            mode, //TODO bruh moment
            start
        );

        this.game_cache.saveGame(match_entity, player_ids, question_ids);

        for (const answer of answers) {
            this.game_cache.saveAnswer(answer.question_id, answer.answer)
        }

        return {
            id: match_entity,
            // IMPORTANT this is the Postrgres match id for results, elo, history
            db_match_id,
            questions: questions,
            answers: answers
        }

    }
}