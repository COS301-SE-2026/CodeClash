import type { MatchStatus } from "src/dtos/match/match.dto";
import { authGet } from "./api.service";
import type { TournamentDTO } from "src/dtos/tournaments/tournament.dto";

export const getTournamentsByStatus = async (status: MatchStatus, token: string): Promise<TournamentDTO[]> => {
    return await authGet(`/tournament/${status}`, token);
}