import Leaderboard from "src/Views/Leaderboard";

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

    constructor(l : string){
        this.league = l;
        this.firstUser = LeaderboardUserData;
        this.secondUser = LeaderboardUserData;
        this.thirdUser = LeaderboardUserData;
        this.fourthUser = LeaderboardUserData;
        this.fifthUser = LeaderboardUserData;
        this.sixthUser = LeaderboardUserData;
        this.sevthUser = LeaderboardUserData;
        this.eigthUser = LeaderboardUserData;
        this.ninthUser = LeaderboardUserData;
        this.tenthUser = LeaderboardUserData;
    }

}

//GET /api/elo/leaderboard

//will eventually filter by league once endpoint is changed
export async function fetchLeaderboardUsers(league : string): Promise<LeaderboardUserProps[]>{
    const api = '/api/elo/leaderboard'
    const finalUrl = `${api}/${league}`
    const res = await fetch(finalUrl); //or however we will add league as an api endpoint, just change this depending on that
    if(!res.ok){
        throw new Error(`Unable to fetch leaderboard`);
    }
        return res.json();
}



