import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "src/context/Socket/hooks/useSocket";
import type { TournamentSocket } from "src/context/Socket/modules/tournament.socket";
import { useUser } from "src/context/User/hooks/useUser";
import type { PlayerDTO } from "src/dtos/match/match.dto"
import type { TournamentDTO } from "src/dtos/tournaments/tournament.dto";
import { useMatchStore } from "src/stores/match-store";
import { useDbId } from "./useDbId";

const MIN_PLAYERS = 8;

export const useTournamentLobby = () => {
    const [players, setPlayers] = useState<PlayerDTO[]>([]);
    const [tournament, setTournament] = useState<TournamentDTO | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { tournamentSocket } = useSocket();
    const {league} = useUser();
    const { tournament_id } = useParams<{ tournament_id: string }>();
    const db_id = useDbId();
    const nav = useNavigate();


    useEffect(() => {

        if (!tournament_id || !tournamentSocket) return;

        getTournament(tournamentSocket, tournament_id);

        const unsub_joined = tournamentSocket.playerJoined((data) => {
            if (data.tournament_id !== tournament_id) return;

            setPlayers((prev) => [...prev, data.player]);
        });

        const unsub_left = tournamentSocket.playerLeft((data) => {
            if (data.tournament_id !== tournament_id) return;

            setPlayers((prev) => prev.filter((p) => p.id !== data.player.id));
        });

        const unsub_cancel = tournamentSocket.tournamentCancelled(async () => {
            setError("Tournament was cancelled");
            await nav('/tournaments');
        })

        const unsub_started = tournamentSocket.tournamentStart(async (data) => {
            console.log("tournament started reeived",data);
            useMatchStore.getState().setMatchData(data.match, data.tournament.tournament_mode, tournament_id);
            await nav(`/tournaments-match/${tournament_id}`);
        })

        return () => {
            unsub_joined();
            unsub_left();
            unsub_cancel();
            unsub_started();
        }
    }, [tournamentSocket, tournament_id]);


    const getTournament = async (tournamentSocket: TournamentSocket, tournament_id: string) => {
        await tournamentSocket.getTournament(tournament_id)
            .then((t) => {
                if (t.ok) {
                    setTournament(t.data!);
                    setPlayers(t.data?.players ?? []);
                    useMatchStore.getState().setMatchMode(t.data!.tournament_mode);
                }
                else setError('Error loading tournament');
            });
    }

    const leave = async (player: PlayerDTO) => {
        if (tournament)
            await tournamentSocket?.leaveTournament({ tournament_id: tournament.tournament_id, player: player });

        await nav('/tournaments');
    }

    const cancel = async () => {
        if (tournament?.host.id === db_id) {
            await tournamentSocket?.cancelTournament(tournament_id!);
        }
        else
            setError('Cannot cancel tournament');
    }

    const start = async () => {
        if (tournament) {
            const data = {
                tournament_id: tournament.tournament_id,
                league: league,

            }
            const res = await tournamentSocket?.startTournament(data);

            console.log("starting tournament", res);
            if (res?.ok && res.data) {
                useMatchStore.getState().setMatchData({
                    match_id: res.data.match.match_id,
                    rounds: res.data.match.rounds,
                    players: res.data.match.players,
                },
                    tournament.tournament_mode,
                    tournament.tournament_id
                );

                await nav(`/tournaments-match/${res.data.tournament.tournament_id}`);
            }
        }

    }

    const is_host = () => {
        return db_id === tournament?.host.id;
    }

    return {
        tournament,
        players,
        error,
        leave,
        cancel,
        MIN_PLAYERS,
        start,
        is_host
    }
}