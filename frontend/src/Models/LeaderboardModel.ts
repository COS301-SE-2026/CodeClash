//I'm assuming we're ranking people by elo which is already influenced by all the possible factors


//REPLACE BELOW INTERFACE WITH USERDTO OR WHATEVER OBJECT CLASS/INTERFACE WE EVENTUALLY USE THROUGHOUT
// TO REPRESENT A USER, THE USEERDTO IS NOT PRESEENT IN THIS BRANCH YET HENCE I AM USING A FILLER CLASS

export interface LeaderboardUserProps{
    
}


export interface LeaderboardProps{
    league: string;
    firstAvatarUrl: string;
    secondAvatarUrl: string;
    thirdAvatarUrl: string;
    fourthAvatarUrl: string;

}