import type { MatchMode, MatchType, RoundDTO } from "src/dtos/match/match.dto";
import type { PlayerStandingDTO } from "src/dtos/tournaments/tournament.dto";
import type { Player } from "src/Models/MatchModel";
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface MatchState {
    match_id: string | null,
    tournament_id?: string | null,
    rounds: RoundDTO[] | null,
    players: (Player | PlayerStandingDTO)[],
    status: 'idle' | 'loading' | 'ready',
    match_mode: MatchMode | undefined,
    match_type: MatchType | null,
    end_time: number | null,    // when the server says the match ends, converted to this browser's clock
    round_idx: number,
    current_question: number,

    setMatchData: (data: {
        match_id: string,
        rounds: RoundDTO[],
        players: (Player | PlayerStandingDTO)[],
        match_type?: MatchType,
        end_time?: number,
        server_time?: number,
    }, match_mode: MatchMode, tournament_id?: string) => void,
    setMatchMode: (mode: MatchMode) => void,
    setEndTime: (end_time: number, server_time: number) => void,
    setProgress: (round_idx: number, current_question: number) => void,
    reset: () => void,
}

// shifting the server's end time by how far this machine's clock is from the server's keeps both players' countdowns the same
const localEndTime = (end_time: number, server_time: number) => end_time - server_time + Date.now();

export const useMatchStore = create<MatchState>()(
    persist(
        (set, get) => ({
            match_id: null,
            rounds: null,
            players: [],
            status: 'idle',
            match_mode: undefined,
            match_type: null,
            end_time: null,
            round_idx: 0,
            current_question: 0,
            tournament_id: null,

            setMatchData: (data, match_mode, tournament_id) => set({
                match_id: data.match_id,
                rounds: data.rounds,
                players: data.players,
                status: 'ready',
                match_mode: match_mode ?? get().match_mode,
                match_type: data.match_type ?? null,
                end_time: !tournament_id && data.end_time && data.server_time ? localEndTime(data.end_time, data.server_time) : null,
                round_idx: 0,
                current_question: 0,
                tournament_id: tournament_id
            }),

            setMatchMode: (mode) => set({ match_mode: mode }),

            setEndTime: (end_time, server_time) => set({ end_time: localEndTime(end_time, server_time) }),

            setProgress: (round_idx, current_question) => set({ round_idx, current_question }),

            reset: () => set({
                match_id: null,
                rounds: null,
                players: [],
                status: 'idle',
                match_mode: undefined,
                match_type: null,
                end_time: null,
                round_idx: 0,
                current_question: 0
            })


        }), {
        name: 'match-store',
        // storage: createJSONStorage(() => sessionStorage)
    }
    )

)