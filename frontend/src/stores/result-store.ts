import type { MatchResultDTO } from "src/dtos/match/result.dto"
import { create } from "zustand"
import { persist } from "zustand/middleware"

type ResultState = {
    results: MatchResultDTO[],
    addResult: (r: MatchResultDTO) => void,
    getResult: (match_id: string) => MatchResultDTO | undefined,
    reset: () => void
}

export const useResultStore = create<ResultState>()(
    persist(
        (set,get) => ({
            results: [],
            addResult: (r: MatchResultDTO) => {
                if (!r || !r.match_id) return;
                set(s => ({ results: [...s.results.filter(x => x.match_id !== r.match_id), r] }))
            },
            getResult: (id: string) => get().results.find(r => r.match_id === id),
            reset: () => set({ results: [] }),
        }), {
        name: 'result-store'
    }
    )

)