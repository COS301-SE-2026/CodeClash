
export interface ProfileProps {
    avatarUrl: string;
    username: string;
    player_level: number;
    current_streak: number;
    winning_streak: number;
    email: string;
    prev_page: string;
}


export const ProfileData: ProfileProps = {
    avatarUrl: '../assets/Profile_Icon.png',
    username: '',
    player_level: 0,
    current_streak: 0,
    winning_streak: 0,
    email: '',
    prev_page: ''

}

