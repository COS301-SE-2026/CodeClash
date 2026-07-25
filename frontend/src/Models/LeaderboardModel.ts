
export interface LeaderboardUserProps{
    avatarUrl: string;
    username: string;
    elo: number;
}

export const LeaderboardUserData : LeaderboardUserProps = {
    avatarUrl: '../assets/Icons/profile_black.png',
    username: 'Username',
    elo: 0,
}


export class LeaderboardProps{
    league: string;
    leagueUrl: string;
    firstUser: LeaderboardUserProps;
    secondUser: LeaderboardUserProps;
    thirdUser: LeaderboardUserProps;
    fourthUser: LeaderboardUserProps;
    fifthUser: LeaderboardUserProps;
    sixthUser: LeaderboardUserProps;
    sevthUser: LeaderboardUserProps;
    eigthUser: LeaderboardUserProps;
    ninthUser: LeaderboardUserProps;
    tenthUser: LeaderboardUserProps;

    constructor(l: string, lUrl: string){
        this.league = l;
        
    }

}

//GET /api/elo/leaderboard

//will eventually filter by league once endpoint is changed
export async function fetchLeaderboardUsers(): Promise<LeaderboardUserProps[]>{
    const res = await fetch('/api/elo/leaderboard');
    if(!res.ok){
        throw new Error(`Unable to fetch leaderboard`);
    }
        return res.json();
}



