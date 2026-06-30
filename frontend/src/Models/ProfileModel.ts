export interface ProfileDetails{
    avatarUrl?: string;
    username: string;
    playerLevel: string;
    currentStreak: string;
}


export interface ProfileRoutes{
    gameGuide: '/gameGuide'; //need to verify eventually when routes are done
    settings: '/settings';
}