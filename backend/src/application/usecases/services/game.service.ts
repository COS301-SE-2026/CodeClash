import { GameMode } from "src/entities/db-entities/questions.entities";
import { CreateGame } from "../create-game";
import { MatchDTO, PlayerDTO, RoundDTO } from "src/entities/dtos/components.dto";
import { GetDifficulty, GetQuestions, GetTotalTime } from "../questions";


export class GameService {
    constructor(
        private readonly createGame: CreateGame,
        private readonly getQuestions: GetQuestions,
        private readonly getDifficulty: GetDifficulty,
        private readonly getTotalTime: GetTotalTime,
    ) { }

    async execute(players: PlayerDTO[], game_mode: GameMode, league: string) {


        let title_temp: string[] = []
        let avg_elo = 0;

        for (const player of players) {
            title_temp.push(player.username);
            avg_elo += player.elo
        }

        avg_elo /= players.length;

        // get questions
        const questions = await this.getQuestions.execute(league, avg_elo, game_mode);
        const difficulty = this.getDifficulty.execute(questions)
        const time = this.getTotalTime.execute(questions)


        // Rounds   - creating one round for now, this logic will need to be updated for multiple 

        let ids: string[] = [];
        for (const question of questions.easy) {
            ids.push(question.id)
        }
        for (const question of questions.medium) {
            ids.push(question.id)
        }
        for (const question of questions.hard) {
            ids.push(question.id)
        }

        const round: RoundDTO = { question_ids: ids }

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

        const match_entity = this.createGame.execute(players, match, [round]);

        return {
            id: match_entity,
            questions: questions
        }

    }
}