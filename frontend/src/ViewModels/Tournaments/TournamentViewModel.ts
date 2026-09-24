import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "src/context/Socket/hooks/useSocket";
import type { PlayerDTO } from "src/dtos/match/match.dto"
import type { TournamentDTO } from "src/dtos/tournaments/tournament.dto";

const MIN_PLAYERS = 8;

export const useTournamentLobby = () => {
    const [players, setPLayers] = useState<PlayerDTO[]>([]);
    const [tournament, setTournament] = useState<TournamentDTO | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { tournamentSocket } = useSocket();
    const { tournament_id } = useParams<{ tournament_id: string }>();
    const nav = useNavigate();


    useEffect(() => {

        if (!tournament_id || !tournamentSocket) return;

        tournamentSocket.getTournament(tournament_id)
            .then((t) => {
                if (t.ok) {
                    setTournament(t.data!);
                    setPLayers(t.data?.players ?? []);
                }
                else setError('Error loading tournament');
            });

        const unsub_joined = tournamentSocket.playerJoined((player) => {
            setPLayers((prev) => [...prev, player]);
        });

        const unsub_left = tournamentSocket.playerLeft((player) => {
            setPLayers((prev) => prev.filter((p) => p.id !== player.id));
        });

        const unsub_cancel = tournamentSocket.tournamentCancelled(() => {
            setError("Tournament was cancelled");
            nav('/tournaments');
        })


        return () => {
            unsub_joined();
            unsub_left();
            unsub_cancel();
        }
    }, [tournamentSocket, tournament]);


    const leave = (player: PlayerDTO) => {
        if (tournament)
            tournamentSocket?.leaveTournament({ tournament_id: tournament.tournament_id, player: player });

        nav('/tournaments');
    }

    return {
        tournament,
        players,
        error,
        leave
    }
}