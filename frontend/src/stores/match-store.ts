import type { MatchQuestionsDTO } from "src/dtos/match/match-questionDTO";
import type { PlayerDTO } from "src/dtos/match/match.dto";
import { create } from 'zustand'

interface MatchState {
    match_id: string | null,
    questions: MatchQuestionsDTO | null,
    players: PlayerDTO[],
    status: 'idle' | 'loading' | 'ready'

    setMatchData: (data: {
        match_id: string,
        questions: MatchQuestionsDTO,
        players: PlayerDTO[]
    }) => void,

    reset: () => void,
}

export const useMatchStore = create<MatchState>((set) => ({
    match_id: null,
    questions: null,
    players: [],
    status: 'idle',

    setMatchData: (data) => set({
        match_id: data.match_id,
        questions: data.questions,
        players: data.players,
        status: 'ready'
    }),

    reset: () => set({
        match_id: null,
        questions: null,
        players: [],
        status: 'idle'
    })
}))