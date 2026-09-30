import type { MatchMode, RoundDTO } from "src/dtos/match/match.dto";
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

    setMatchData: (data: {
        match_id: string,
        rounds: RoundDTO[],
        players: (Player | PlayerStandingDTO)[],
    }, match_mode: MatchMode, tournament_id?: string) => void,

    setMatchMode: (mode: MatchMode) => void,
    reset: () => void,
}

export const useMatchStore = create<MatchState>()(
    persist(
        (set, get) => ({
            match_id: null,
            rounds: null,
            players: [],
            status: 'idle',
            match_mode: undefined,
            tournament_id: null,

            setMatchData: (data, match_mode, tournament_id) => set({
                match_id: data.match_id,
                rounds: data.rounds,
                players: data.players,
                status: 'ready',
                match_mode: match_mode ?? get().match_mode,
                tournament_id: tournament_id
            }),

            setMatchMode: (mode) => set({ match_mode: mode }),

            reset: () => set({
                match_id: null,
                rounds: null,
                players: [],
                status: 'idle',
                match_mode: undefined
            })


        }), {
        name: 'match-store',
        // storage: createJSONStorage(() => sessionStorage)
    }
    )

)