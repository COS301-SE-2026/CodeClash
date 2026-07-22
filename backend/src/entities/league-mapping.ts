import { LeagueDTO } from "./dtos/league.dto"


const leagues = new Map<string, LeagueDTO>();

leagues.set("Mercury", { name: "Mercury", difficulty: [1, 2, 3], elo: [600, 1199] })
leagues.set("Venus", { name: "Venus", difficulty: [4, 5, 6], elo: [1200, 1799] })
leagues.set("Earth", { name: "Earth", difficulty: [7, 8, 9], elo: [1800, 2399] })
leagues.set("Mars", { name: "Mars", difficulty: [10, 11, 12], elo: [2400, 2999] })
leagues.set("Jupiter", { name: "Jupiter", difficulty: [13, 14, 15], elo: [3000, 3599] })
leagues.set("Saturn", { name: "Saturn", difficulty: [16, 17, 18], elo: [3600, 4199] })
leagues.set("Uranus", { name: "Uranus", difficulty: [19, 20, 21], elo: [4200, 8799] })
leagues.set("Neptune", { name: "Neptune", difficulty: [22, 23, 12], elo: [4800, 5400] })

// Returns a mapping of what percentage of the question difficulties should be selected

export const leagueMapping = (league: string, avg_elo: number) => {
    const user_league = leagues.get(league);

    if (!user_league) return null;

    const distances: number[] = [];
    const weights: number[] = [];

    for (var i = user_league.elo[0]!; i < user_league.elo[1]!; i += 600) {
        const upper_bound = i + 200;

        const midpoint = (i + upper_bound) / 2;

        const value = Math.abs(avg_elo - midpoint)
        distances.push(value);
        weights.push(1/value)
    }


    const sum_weight = weights.reduce((total, curr)=> total + curr,0);
    const percentages: number[] = []

    for(var i = 0; i < 3; i++){
        percentages.push((weights[i]!/sum_weight )* 100);
    }
 

    const result = {
        [user_league.difficulty[0]!]: percentages[0],
        [user_league.difficulty[1]!]: percentages[2],
        [user_league.difficulty[2]!]: percentages[2],
    }

}