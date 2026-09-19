import { IMatchCache } from "src/application/interfaces/cache/IGameCache";
import { MatchMode, MatchType } from "src/entities/dtos/match/match.dto";
import { MatchDTO, PlayerDTO, RoundDTO } from "src/entities/dtos/components.dto";

import { MatchCreationSystem} from "../../systems/match-creation.system";

import { GetAnswers } from "../answers.service";
import { GetDifficulty, GetQuestions, GetTotalTime } from "../questions.service";
import { IMatchRepository } from "src/application/interfaces/repositories/IMatchRepository";
import { IUserRepository } from "src/application/interfaces/repositories/IUserRepository";

export class MatchCreationService {
    constructor(
        private readonly create_match: MatchCreationSystem,
        private readonly getQuestions: GetQuestions,
        private readonly getDifficulty: GetDifficulty,
        private readonly getTotalTime: GetTotalTime,
        private readonly getAnswers: GetAnswers,
        private readonly match_cache: IMatchCache,
        private readonly match_repo: IMatchRepository,
        private readonly user_repo: IUserRepository
    ) { }

    async execute(players: PlayerDTO[], match_mode: MatchMode, league: string, game_type: MatchType) {

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
        const questions = await this.getQuestions.execute(league, avg_elo, match_mode);
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
            match_mode: match_mode,
            match_type: game_type,
            difficulty: difficulty,
            winner: -1,
            start_time: start,
            end_time: new Date(start.getTime() + (time * 60 * 1000))
        }

        const match_entity = this.create_match.execute(players, match, [round], question_ids.length);

        this.match_cache.saveMatch(match_entity, player_ids, question_ids);

        for (const answer of answers) {
            await this.match_cache.saveAnswer(answer)
        }


        const ids = players.map((p) => p.id);
        const db_match_id = await this.match_repo.createMatch(ids, game_type, match_mode, start); //mode is math or programming


        return {
            match_entity: match_entity,
            match_id: db_match_id,
            questions: questions,
            answers: answers
        }

    }
}