import { fetchUserAttributes, getCurrentUser } from "aws-amplify/auth";

export interface ProfileDetails{
    avatarUrl: string;
    username: string;
    playerLevel: number;
    currentStreak: number;
}

export interface ProfileRoutes{
    gameGuide: '/gameGuide'; //need to verify eventually when routes are done
    settings: '/settings';
}

export const ProfileData : ProfileDetails = {
    avatarUrl: '../assets/Profile_Icon.png',
    username: '',
    playerLevel: 0,
    currentStreak: 0,

}

export class ProfileServices {
    static async getProfile(userId: string): Promise<ProfileDetails> {
        const user = getCurrentUser();
        const userAttributes = fetchUserAttributes();

        return{
            avatarUrl: (await userAttributes).picture ?? '../assets/Profile_Icon.png',
            username: (await userAttributes).name ?? "",
            playerLevel: 0, //AFTER ADDING A LEVEL ATTRIBUTE TO THE AWS COGNITO USER POOL, COME BACK HERE AND CHANGE THIS!!!
            currentStreak: 0 //AFTER ADDING A STREAK ATTRIBUTE TO THE AWS COGNITO USER POOL, COME BACK HERE AND CHANGE THIS!!!
        };
    }
}