import { LeagueDTO } from "src/interface-adapters/dtos/league.dto"


const leagues = new Map<string, LeagueDTO>();

leagues.set("Mercury", { name: "Mercury", difficulty: [1, 2, 3], elo: [600, 1199], question_number: 5 })
leagues.set("Venus", { name: "Venus", difficulty: [4, 5, 6], elo: [1200, 1799], question_number: 10 })
leagues.set("Earth", { name: "Earth", difficulty: [7, 8, 9], elo: [1800, 2399], question_number: 15 })
leagues.set("Mars", { name: "Mars", difficulty: [10, 11, 12], elo: [2400, 2999], question_number: 20 })
leagues.set("Jupiter", { name: "Jupiter", difficulty: [13, 14, 15], elo: [3000, 3599], question_number: 25 })
leagues.set("Saturn", { name: "Saturn", difficulty: [16, 17, 18], elo: [3600, 4199], question_number: 30 })
leagues.set("Uranus", { name: "Uranus", difficulty: [19, 20, 21], elo: [4200, 8799], question_number: 35 })
leagues.set("Neptune", { name: "Neptune", difficulty: [22, 23, 12], elo: [4800, 5400], question_number: 40 })

// Returns a mapping of what percentage of the question difficulties should be selected

export const leagueMapping = (league: string, avg_elo: number) => {
    const user_league = leagues.get(league);

    if (!user_league) return null;

    const weights: number[] = [];

    const start = user_league.elo[0]!;

    for (let i = 0; i < 3; i++) {
        const lower_bound = start + i * 200;
        const upper_bound = lower_bound + 200;

        const midpoint = (lower_bound + upper_bound) / 2;

        const value = Math.abs(avg_elo - midpoint)
        weights.push(1 / Math.max(value, 1))
    }


    const sum_weight = weights.reduce((total, curr) => total + curr, 0);
    const percentages: number[] = []

    for (let i = 0; i < 3; i++) {
        percentages.push(weights[i]! / sum_weight);
    }


    return {
        easy: { difficulty: user_league.difficulty[0]!, percentage: percentages[0] },
        medium: { difficulty: user_league.difficulty[1]!, percentage: percentages[1] },
        hard: { difficulty: user_league.difficulty[2]!, percentage: percentages[2] },
        question_number: user_league.question_number
    }


}