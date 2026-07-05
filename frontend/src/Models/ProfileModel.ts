


import { fetchUserAttributes } from "aws-amplify/auth";
// import { getCurrentUser } from "aws-amplify/auth"

export interface ProfileDetails{
    avatarUrl: string;
    username: string;
    playerLevel: number;
    currentStreak: number;
}


export const ProfileData : ProfileDetails = {
    avatarUrl: '../assets/Profile_Icon.png',
    username: '',
    playerLevel: 0,
    currentStreak: 0,

}

export class ProfileServices {
    static async getProfile(): Promise<ProfileDetails> {
        const userAttributes = fetchUserAttributes();

        return{
            avatarUrl: (await userAttributes).picture ?? '../assets/Profile_Icon.png',
            username: (await userAttributes).name ?? "",
            playerLevel: 0, //AFTER ADDING A LEVEL ATTRIBUTE TO THE USERS TABLE, COME BACK HERE AND CHANGE THIS, AND INSTEAD OF FETCHING USERS FROM THE AWS COGNITO POOL, USE TABLES!!!
            currentStreak: 0 //AFTER ADDING A STREAK ATTRIBUTE TO THE USERS TABLE, COME BACK HERE AND CHANGE THIS, AND INSTEAD OF FETCHING USERS FROM THE AWS COGNITO POOL, USE TABLES!!!
        };
    }
}