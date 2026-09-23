import { ITournamentCache } from "src/application/interfaces/cache/ITournamentCache";
import { PlayerDTO } from "src/entities/dtos/components.dto";
import { MatchStatus } from "src/entities/dtos/match/match.dto";
import { TournamentDTO } from "src/entities/dtos/tournaments/tournaments.dto";

export class TournamentService {
    constructor(
        private readonly tournament_cache: ITournamentCache
    ) { }

    async joinTournament(tournament_id: string, player: PlayerDTO): Promise<TournamentDTO> {
        try {
            await this.tournament_cache.addPlayer(tournament_id, player);
            const tournament = await this.tournament_cache.getTournament(tournament_id);

            if (!tournament) throw new Error("Tournament not found");

            return tournament;
        }
        catch (error) {
            console.error("Tournament Service Join error: ", error);
            throw (`${error}`);
        }
    }

    async leaveTournament(tournament_id: string, player: PlayerDTO) {
        try {
            const tournament = await this.tournament_cache.getTournament(tournament_id);
            if (!tournament) throw new Error("Tournament not found");

            if (tournament?.status != MatchStatus.Waiting) throw new Error("Cannot leave tournament");

            await this.tournament_cache.removePlayer(tournament_id, player.id);
        }
        catch (error) {
            console.error("Tournament Service Join error: ", error);
            throw (`${error}`);
        }
    }
}