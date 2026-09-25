import type { RoundDTO } from "src/dtos/match/match.dto";
import type { Player } from "src/Models/MatchModel";
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface MatchState {
    match_id: string | null,
    rounds: RoundDTO[] | null,
    players: Player[],
    status: 'idle' | 'loading' | 'ready'

    setMatchData: (data: {
        match_id: string,
        rounds: RoundDTO[],
        players: Player[]
    }) => void,

    reset: () => void,
}

export const useMatchStore = create<MatchState>()(
    persist(
        (set) => ({
            match_id: null,
            rounds: null,
            players: [],
            status: 'idle',

            setMatchData: (data) => set({
                match_id: data.match_id,
                rounds: data.rounds,
                players: data.players,
                status: 'ready'
            }),

            reset: () => set({
                match_id: null,
                rounds: null,
                players: [],
                status: 'idle'
            })


        }), {
        name: 'match-store',
        storage: createJSONStorage(() => sessionStorage)
    }
    )

)