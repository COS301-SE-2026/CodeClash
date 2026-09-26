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
    const { userId, elo, username, league } = useUser();
    const player: PlayerDTO = {
        id: userId,
        elo: elo,
        username: username
    }

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
            min_players: number
        }) => {

        const host: PlayerDTO = {
            id: userId,
            elo: elo,
            username: username
        }
        const create = {
            start_date: data.start_date,
            match_mode: data.match_mode,
            host: host,
            title: data.title,
            min_players: data.min_players
        }
        const hosted = await tournamentSocket?.hostTournament(create);

        if (!hosted) {
            return { ok: false, error: "Error creating tournament." };
        }

        if (hosted.ok && hosted.data !== undefined) {
            setTournaments((prev) => [...prev, hosted.data!]);
            console.log(hosted.data!);
        }

        return hosted;
    }

    const joinTournamnet = async (tournament_id: string) => {
        const player: PlayerDTO = {
            id: userId,
            elo: elo,
            username: username,
            league: league
        }

        const response = await tournamentSocket?.joinTournament({ tournament_id, player });
        if (response?.ok) {
            return true;
        }
        return false;
    }

    const leaveTournament = async (tournament_id: string) => {
        const player: PlayerDTO = {
            id: userId,
            elo: elo,
            username: username,
            league: league
        }

        const response = await tournamentSocket?.leaveTournament({ tournament_id, player });
        if (response?.ok) {
            return true;
        }
        return false;
    }

    const handleJoined = (data: { player: PlayerDTO, tournament_id: string }) => {
        setTournaments((prev) =>
            prev.map((t) => t.tournament_id === data.tournament_id ? { ...t, players: [...t.players, data.player] } : t)
        )
    }

    const handleLeave = (data: { player: PlayerDTO, tournament_id: string }) => {
        setTournaments((prev) =>
            prev.map((t) => t.tournament_id === data.tournament_id ? { ...t, players: t.players.filter(p => p.id !== data.player.id) } : t)
        )
    }

    const starts_in = (start_date: Date) => {
        const diff_ms = start_date.getTime() - Date.now();

        if (diff_ms <= 0) return "NOW";

        const total_seconds = Math.floor(diff_ms / 1000);
        const days = Math.floor(total_seconds / 86400);
        const hours = Math.floor((total_seconds % 86400) / 3600);
        const minutes = Math.floor((total_seconds % 3600) / 60);
        const seconds = total_seconds % 60;

        let time = "";

        if (days > 0) time += `${days}d `;
        if (hours > 0) time += `${hours}h `;
        if (minutes > 0) time += `${minutes}m `;
        if (seconds > 0) time += `${seconds}s`;

        return time;
    }

    useEffect(() => {
        if (!token || !tournamentSocket) return;

        getTournaments();

        const unsub_created = tournamentSocket.tournamentCreated(getTournaments);
        const unsub_joined = tournamentSocket.playerJoined(handleJoined);
        const unsub_left = tournamentSocket.playerLeft(handleLeave);
        const unsub_join_failed = tournamentSocket.joinFailed((data) => { console.log(data) });
        const unsub_leave_failed = tournamentSocket.leaveFailed((data) => { console.log(data) });
        return () => {
            unsub_created();
            unsub_joined();
            unsub_left();
            unsub_join_failed();
            unsub_leave_failed();
        }
    }, [token, tournamentSocket]);

    return { 
        lobby, 
        tournaments, 
        getTournaments, 
        createTournament, 
        joinTournamnet, 
        leaveTournament, 
        player,
        starts_in
    };
}