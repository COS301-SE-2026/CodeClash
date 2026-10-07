import { IMatchCache } from "src/application/interfaces/cache/IMatchCache";
import { MatchMode, MatchType } from "src/entities/dtos/matches/match.dto";
import { MatchDTO, PlayerDTO } from "src/entities/dtos/matches/match-component.dto";

import { MatchCreationSystem } from "../../systems/match-creation.system";

import { GetAnswers } from "../answers.service";
import { GetQuestions, GetTotalTime } from "../questions.service";
import { IMatchRepository } from "src/application/interfaces/repositories/IMatchRepository";
import { IUserRepository } from "src/application/interfaces/repositories/IUserRepository";
import { IQuestionRepository } from "src/application/interfaces/repositories/IQuestionRepository";

export class MatchCreationService {
    constructor(
        private readonly create_match: MatchCreationSystem,
        private readonly getQuestions: GetQuestions,
        private readonly getTotalTime: GetTotalTime,
        private readonly getAnswers: GetAnswers,
        private readonly match_cache: IMatchCache,
        private readonly match_repo: IMatchRepository,
        private readonly user_repo: IUserRepository,
        private readonly question_repo: IQuestionRepository
    ) { }

    async execute(players: PlayerDTO[], match_mode: MatchMode, league: string, match_type: MatchType, title?: string) {
        let avg_elo = 0;
        const usernames = await Promise.all(
            players.map(async (player) => {
                avg_elo += player.elo
                const user = await this.user_repo.getUserData(player.id, 'username');
                return user!.username!;
            })
        )

        const match_title = match_type === MatchType.tournament ? title : usernames.join(" vs ");

        const player_ids = players.map((player) => player.id);
        avg_elo /= players.length;

        // get questions
        const questions = await this.getQuestions.execute(league, avg_elo, match_mode);

        const time = this.getTotalTime.execute(questions)


        // Rounds 
        const q_easy = questions.easy.map(q => q.id);
        const q_medium = questions.medium.map(q => q.id);
        const q_hard = questions.hard.map(q => q.id);

        // get answers 
        const q_ids = [...q_easy, ...q_medium, ...q_hard];
        if (q_ids.length ===0) throw new Error('No questions available, is the database seeded?');
        
        const answers = await this.getAnswers.execute(q_ids);

        // templates for programming 
        if (match_mode === MatchMode.Programming) {
            const question_pool = [...questions.easy, ...questions.medium, ...questions.hard];
            await Promise.all(
                question_pool.map(async (q) => {
                    const templates = await this.question_repo.getTemplates(q.id);

                    q.templates = templates.map(t => ({
                        language: t.language,
                        judge0_language_id: t.judge0_language_id,
                        starter_code: t.starter_code
                    }))
                })
            );
        }

        // Match 

        const start = new Date();
        const match_data: MatchDTO = {
            title: match_title!,
            status: 'active',
            match_mode: match_mode,
            match_type: match_type,
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
        const db_match_id = await this.match_repo.createMatch(ids, match_type, match_mode, start, match_title!); //mode is math or programming

        return {
            match_entity: match.match_entity,
            match_id: db_match_id,
            rounds: match.rounds,
            answers: answers,
            end_time: match_data.end_time
        }
    }
}