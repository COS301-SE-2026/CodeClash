import { useEffect, useState } from "react";
import { useTournamentLobby } from "./TournamentLobby"
import type { TournamentDTO } from "src/dtos/tournaments/tournament.dto";
import { getTournamentsByStatus } from "src/services/tournament.service";
import { useAuth } from "src/context/Auth/hooks/useAuth";
import { useSocket } from "src/context/Socket/hooks/useSocket";

export const useTournament = () => {
    const lobby = useTournamentLobby();
    const { token } = useAuth();
    const [tournaments, setTournaments] = useState<TournamentDTO[]>([]);
    const { tournamentSocket } = useSocket();

    const getTournaments = async () => {
        if (!token) return;

        const data: TournamentDTO[] = await getTournamentsByStatus('waiting', token!);
        setTournaments(data);
    }


    useEffect(() => {
        if (!token || !tournamentSocket) return;

        getTournaments();

        const unsub_created = tournamentSocket.tournamentCreated(getTournaments);

        return () => {
            unsub_created();
        }
    }, []);

    return { lobby, tournaments, getTournaments };
}