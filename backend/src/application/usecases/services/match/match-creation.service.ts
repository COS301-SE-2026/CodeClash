import { IMatchCache } from "src/application/interfaces/cache/IMatchCache";
import { MatchMode, MatchType } from "src/entities/dtos/matches/match.dto";
import { MatchDTO, PlayerDTO } from "src/entities/dtos/matches/match-component.dto";

import { MatchCreationSystem } from "../../systems/match-creation.system";

import { GetAnswers } from "../answers.service";
import { GetQuestions, GetTotalTime } from "../questions.service";
import { IMatchRepository } from "src/application/interfaces/repositories/IMatchRepository";
import { IUserRepository } from "src/application/interfaces/repositories/IUserRepository";

export class MatchCreationService {
    constructor(
        private readonly create_match: MatchCreationSystem,
        private readonly getQuestions: GetQuestions,
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
        const time = this.getTotalTime.execute(questions)

        if (!questions) throw new Error("Error fetching questions")

        // Rounds 
        const q_easy = questions.easy.map(q => q.id);
        const q_medium = questions.medium.map(q => q.id);
        const q_hard = questions.hard.map(q => q.id);

        // get answers 
        const q_ids = [...q_easy, ...q_medium, ...q_hard];
        const answers = await this.getAnswers.execute(q_ids);

        // Match 

        const start = new Date();
        const match_data: MatchDTO = {
            title: title,
            status: 'active',
            match_mode: match_mode,
            match_type: game_type,
            winner: -1,
            start_time: start,
            end_time: new Date(start.getTime() + (time * 60 * 1000))
        }

        const match = this.create_match.execute(players, match_data, questions);
        this.match_cache.saveMatch(match.match_entity, player_ids, q_ids);

        for (const answer of answers) {
            await this.match_cache.saveAnswer(answer)
        }


        const ids = players.map((p) => p.id);
        const db_match_id = await this.match_repo.createMatch(ids, game_type, match_mode, start); //mode is math or programming

        return {
            match_entity: match.match_entity,
            match_id: db_match_id,
            rounds: match.rounds,
            answers: answers
        }
    }
}