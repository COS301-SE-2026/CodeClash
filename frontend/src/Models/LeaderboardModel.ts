//I'm assuming we're ranking people by elo which is already influenced by all the possible factors


//REPLACE BELOW INTERFACE WITH USERDTO OR WHATEVER OBJECT CLASS/INTERFACE WE EVENTUALLY USE THROUGHOUT
// TO REPRESENT A USER, THE USEERDTO IS NOT PRESEENT IN THIS BRANCH YET HENCE I AM USING A FILLER CLASS

export interface LeaderboardUserProps{
    avatarUrl: string;
    username: string;
    elo: number;
}

export const LeaderboardUserData : LeaderboardUserProps = {
    avatarUrl: '../assets/Icons/profile_black.png',
    username: '',
    elo: 0,
}


export interface LeaderboardProps{
    league: string;
    prev_page: string;
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

}

