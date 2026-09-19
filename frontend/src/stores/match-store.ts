import type { MatchQuestionsDTO } from "src/dtos/match/match-questionDTO";
import type { Player } from "src/Models/MatchModel";
import { create } from 'zustand'

interface MatchState {
    match_id: string | null,
    questions: MatchQuestionsDTO | null,
    players: Player[],
    status: 'idle' | 'loading' | 'ready'

    setMatchData: (data: {
        match_id: string,
        questions: MatchQuestionsDTO,
        players: Player[]
    }) => void,

    reset: () => void,
}

export const useMatchStore = create<MatchState>((set) => ({
    match_id: null,
    questions: null,
    players: [],
    status: 'idle',

    setMatchData: (data) => {
        set({
        match_id: data.match_id,
        questions: data.questions,
        players: data.players,
        status: 'ready'
    })},

    reset: () => set({
        match_id: null,
        questions: null,
        players: [],
        status: 'idle'
    })
}))