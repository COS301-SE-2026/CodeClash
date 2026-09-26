import { useEffect, useState } from "react";
import { useTournamentLobby } from "./TournamentLobby"
import type { TournamentDTO } from "src/dtos/tournaments/tournament.dto";
import { getTournamentsByStatus } from "src/services/tournament.service";
import { useAuth } from "src/context/Auth/hooks/useAuth";
import { useSocket } from "src/context/Socket/hooks/useSocket";
import { type MatchMode, type PlayerDTO } from "src/dtos/match/match.dto";
import { useUser } from "src/context/User/hooks/useUser";

export const useTournament = () => {
    const lobby = useTournamentLobby();
    const { token } = useAuth();
    const [tournaments, setTournaments] = useState<TournamentDTO[]>([]);
    const { tournamentSocket } = useSocket();
    const { userId, elo, username } = useUser();

    const getTournaments = async () => {
        if (!token) return;

        const data: TournamentDTO[] = await getTournamentsByStatus('waiting', token!);
        setTournaments(data);
    }

    const createTournament = async (
        data: {
            title: string,
            match_mode: MatchMode,
            start_date: Date,
            players: number,
        }) => {

        const host: PlayerDTO = {
            id: userId,
            elo: elo,
            username: username
        }
        const create = {
            start_date: data.start_date,
            match_mode: data.match_mode,
            host: host
        }
        const hosted = await tournamentSocket?.hostTournament(create);

        if (!hosted) {
            return { ok: false, error: "Error creating tournament." };
        }

        if (hosted.ok && hosted.data !== undefined) {
            setTournaments((prev) => [...prev, hosted.data!]);
        }
        return hosted;
    }


    useEffect(() => {
        if (!token || !tournamentSocket) return;

        getTournaments();

        const unsub_created = tournamentSocket.tournamentCreated(getTournaments);

        return () => {
            unsub_created();
        }
    }, []);

    return { lobby, tournaments, getTournaments, createTournament };
}