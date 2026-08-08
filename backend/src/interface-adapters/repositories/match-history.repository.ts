import { Repository } from 'typeorm';
import { Match, MatchLog } from 'src/entities/db-entities/match.entities';
import { MatchStats } from 'src/entities/db-entities/match-stats.entities';
import { IMatchHistoryRepository, MatchHistoryRow, MatchHistoryDetail, MatchHistoryQuestionStat } from 'src/application/interfaces/repositories/IMatchHistoryRepository';

export class MatchHistoryRepository implements IMatchHistoryRepository {
    constructor(
        private readonly matchRepo: Repository<Match>,
        private readonly matchLogRepo: Repository<MatchLog>,
        private readonly matchStatsRepo: Repository<MatchStats>
    ) {}

    async getMatchHistory(user_id: string): Promise<MatchHistoryRow[]> {
        const matches = await this.matchRepo.find({
            where: [
                { player1: { user_id } },
                { player2: { user_id } }
            ],
            order: { match_start: 'DESC' }
        });

        const rows: MatchHistoryRow[] = [];

        for (const match of matches){
            const log = await this.matchLogRepo.findOne({
                where: { match: { match_id: match.match_id } },
                relations: { winner: true, loser: true }
            });

            let result: 'WIN' | 'LOSS' | 'DRAW' = 'DRAW';
            if (log) result = log.winner.user_id === user_id ? 'WIN' : 'LOSS';

            const score = await this.buildScore(match.match_id);

            rows.push({
                match_id: match.match_id,
                mode: match.mode,
                game_type: match.game_mode,
                match_start: match.match_start!,
                result,
                score
            
            });
        }

        return rows;
    }

    async getMatchDetails(match_id: string, user_id: string): Promise<MatchHistoryDetail> {
        const match = await this.matchRepo.findOne({ where: { match_id } });
        if (!match) throw new Error(`Match ${match_id} not found`);

        const log = await this.matchLogRepo.findOne({
            where:  { match: { match_id } },
            relations: { winner: true, loser: true }
        });

        let result: 'WIN' | 'LOSS' | 'DRAW' = 'DRAW';
        if (log) result = log.winner.user_id === user_id ? 'WIN' : 'LOSS';

        const score = await this.buildScore(match_id);

        const userStats = await this.matchStatsRepo.findOne({
            where: { match: { match_id }, user: { user_id } }
        });

        if (!userStats) throw new Error(`Stats not found for match ${match_id}`);

        const totalSeconds = Math.floor(userStats.total_time / 1000);
        const mm = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        const ss = String(totalSeconds % 60).padStart(2, '0');

        // making a flat list representing correct/incorrect count
        const questions = Array.from({ length: userStats.num_correct }, (_, i) => ({
            label: `QUESTION ${i + 1}`,
            correctness: true
        }));

        return {
            match_id: match.match_id,
            mode: match.mode,
            game_type: match.game_mode,
            match_start: match.match_start!,
            result,
            score,
            questions,
            totalTime: `${mm}:${ss}`
        };
    }

    private async buildScore(match_id: string): Promise<string> {
        const stats = await this.matchStatsRepo.find({ where: { match: { match_id }}});
        if(stats.length !== 2) return '0-0';
        return `${stats[0]!.num_correct}-${stats[1]!.num_correct}`;
    }
}