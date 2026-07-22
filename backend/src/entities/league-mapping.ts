import { LeagueDTO } from "./dtos/league.dto"


const leagess: LeagueDTO[] = [
    
    { name: "Venus", difficulty: [4, 5, 6], elo: [1200, 1799] },
    { name: "Earth", difficulty: [7, 8, 9], elo: [1800, 2399] },
    { name: "Mars", difficulty: [10, 11, 12], elo: [2400, 2999] },
    { name: "Jupiter", difficulty: [13, 14, 15], elo: [3000, 3599] },
    { name: "Saturn", difficulty: [16, 17, 18], elo: [3600, 4199] },
    { name: "Uranus", difficulty: [19, 20, 21], elo: [4200, 8799] },
    { name: "Neptune", difficulty: [22, 23, 12], elo: [4800, 5400] },
]

const leagues = new Map<string,LeagueDTO>();

leagues.set("Mercury", { name: "Mercury", difficulty: [1, 2, 3], elo: [600, 1199] })
leagues.set("Mercury", { name: "Mercury", difficulty: [1, 2, 3], elo: [600, 1199] })
leagues.set("Mercury", { name: "Mercury", difficulty: [1, 2, 3], elo: [600, 1199] })
leagues.set("Mercury", { name: "Mercury", difficulty: [1, 2, 3], elo: [600, 1199] })
leagues.set("Mercury", { name: "Mercury", difficulty: [1, 2, 3], elo: [600, 1199] })
leagues.set("Mercury", { name: "Mercury", difficulty: [1, 2, 3], elo: [600, 1199] })
leagues.set("Mercury", { name: "Mercury", difficulty: [1, 2, 3], elo: [600, 1199] })
leagues.set("Mercury", { name: "Mercury", difficulty: [1, 2, 3], elo: [600, 1199] })


export const leagueMapping = (league: string, avg_elo: number) => {
    const user_league = leages.

}