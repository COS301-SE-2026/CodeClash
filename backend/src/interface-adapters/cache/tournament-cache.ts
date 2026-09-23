import Redis from "ioredis";
import { ITournamentCache } from "src/application/interfaces/cache/ITournamentCache";
import { PlayerDTO } from "src/entities/dtos/components.dto";
import { MatchMode, MatchStatus } from "src/entities/dtos/match/match.dto";
import { TournamentDTO } from "src/entities/dtos/tournaments/tournaments.dto";

export class TournamentCache implements ITournamentCache {

    constructor(
        private readonly redis: Redis
    ) { }

    async createTournament(tournament_id: string, start_date: Date, match_mode: MatchMode): Promise<void> {

        const tournament: TournamentDTO = {
            tournament_id: tournament_id,
            rounds: [],
            players: [],
            tournament_mode: match_mode,
            status: MatchStatus.Waiting,
            created_at: new Date(),
            start_date: start_date
        }

        await this.redis.set(`tournament:${tournament_id}`, JSON.stringify(tournament));
    }

    async addPlayer(tournament_id: string, player: PlayerDTO): Promise<void> {
        const tournament = await this.redis.get(`tournament:${tournament_id}`);

        if (!tournament) throw new Error("invalid tournament id");

        const data: TournamentDTO = JSON.parse(tournament);

        data.players.push(player);

        await this.redis.set(`tournament:${tournament_id}`, JSON.stringify(data));
    }

    async removePlayer(tournament_id: string, player_id: string): Promise<void> {
        const tournament = await this.redis.get(`tournament:${tournament_id}`);

        if (!tournament) throw new Error("invalid tournament id");

        const data: TournamentDTO = JSON.parse(tournament);
        const removed = data.players.filter(p => p.id !== player_id);
        data.players = removed;

        await this.redis.set(`tournament:${tournament_id}`, JSON.stringify(data));

    }

    async getTournament(tournament_id: string): Promise<TournamentDTO | null> {
        const tournament = await this.redis.get(`tournament:${tournament_id}`);
        if (!tournament) return null;

        const data: TournamentDTO = JSON.parse(tournament);
        return data;
    }

    async deleteTournament(tournament_id: string): Promise<void> {
        await this.redis.del(`tournament:${tournament_id}`);
     }
}