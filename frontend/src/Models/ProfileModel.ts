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

    }
}