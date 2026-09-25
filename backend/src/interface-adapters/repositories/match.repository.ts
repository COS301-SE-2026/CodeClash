import { Repository } from 'typeorm';
import { Matches } from 'src/entities/database/match.entities';
import { IMatchRepository } from 'src/application/interfaces/repositories/IMatchRepository';
import { MatchMode, MatchStatus, MatchType, MatchPlayer, MatchHistoryRow, MatchResultDTO, SkillProgressGame } from 'src/entities/dtos/matches/match.dto';
import { IUserRepository } from 'src/application/interfaces/repositories/IUserRepository';

export class MatchRepository implements IMatchRepository {
    constructor(
        private readonly match_repo: Repository<Matches>,
        private readonly user_repo: IUserRepository
    ) { }

    async createMatch(players: string[], type: MatchType, match_mode: MatchMode, match_start: Date): Promise<string> {
        if (players.length < 2) throw new Error("Not Enough Players");

        const match = this.match_repo.create(
            {
                players: players.map(id => ({
                    id,
                    position: 0,
                    elo_change: 0,
                    num_correct: 0,
                    total_time: 0,
                    elimination_round: null
                })),
                questions: [],
                power_ups: [],
                match_type: type,
                match_mode: match_mode,
                match_start: match_start,
                status: MatchStatus.Starting
            });

        const saved = await this.match_repo.save(match);
        return saved.match_id;
    }//end promise


    async completeMatch(match_id: string, status: MatchStatus.Abandoned | MatchStatus.Completed): Promise<void> {
        await this.match_repo.update(match_id, { status, match_end: new Date() });
    }

    async updatePlayers(match_id: string, players: MatchPlayer[]): Promise<void> {
        await this.match_repo.update(match_id, { players });
    }

    async getMatchHistory(user_id: string): Promise<MatchHistoryRow[]> {
        const matches = await this.match_repo.createQueryBuilder('match')
            .where('match.status = :status', { status: 'completed' })
            .orderBy('match.match_end', 'DESC')
            .getMany();

        return matches.map(match => {
            const me = match.players.find(p => p.id === user_id);

            if (!me) return null;

            const data: MatchHistoryRow = {
                match_id: match.match_id,
                match_type: match.match_type,
                match_mode: match.match_mode,
                match_start: match.match_start!,
                match_end: match.match_end,
                position: me.position,
                elimination_round: me.elimination_round,
                score: {
                    correct: me.num_correct,
                    total: match.questions.length,
                    time: me.total_time
                }
            };

            return data
        }).filter((match): match is MatchHistoryRow => match != null);
    }

  async getSkillProgress(user_id: string, since: Date, older_games: number): Promise<SkillProgressGame[]> {
    const me = JSON.stringify([{ id: user_id, questions: [] }]);

    const query = () => this.match_repo.createQueryBuilder('match')
        .where('match.status = :status', { status: MatchStatus.Completed })
        .andWhere('match.players @> CAST(:me AS jsonb)', { me })
        .orderBy('match.match_end', 'DESC');

    const recent = await query()
      .andWhere('match.match_end >= :since', { since })
      .getMany();

    const older = await query()
      .andWhere('match.match_end < :since', { since })
      .andWhere('match.match_type != :type', { type: MatchType.Casual })
      .take(older_games)
      .getMany();

    return [...recent, ...older].map(match => {
const player = match.players.find(p => p.id === user_id)!;

        return {
            match_id: match.match_id,
            match_type: match.match_type,
            match_mode: match.match_mode,
            match_start: match.match_start,
            match_end: match.match_end,
            position: player.position,
            league: player.league ?? null,
            questions: player.questions ?? []
        };
    });
  }

    async buildMatchResult(match_id: string): Promise<MatchResultDTO> {
        const match = await this.match_repo.findOne({ where: { match_id } });

        if (!match) throw new Error("Match not found");

        const players = await Promise.all(
            match.players.sort((a, b) => a.position - b.position)
                .map(async (player) => {
                    const user = await this.user_repo.getUser(player.id);
                    if (!user) throw new Error("User not found");

                    const rank = await this.user_repo.getUserRank(player.id);

                    return {
                        user_id: player.id,
                        username: user.username!,
                        avatar: user.avatar_id!,
                        correctness: (match.questions.length > 0) ? player.num_correct / match.questions.length : 0,
                        speed: player.total_time,
                        eloEffect: player.elo_change,
                        position: player.position,
                        rank: rank?.rank ?? null
                    };
                })
        );
        return {
            match_id,
            players
        };
    }

}