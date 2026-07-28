
export interface ProfileProps {
    avatarUrl: string;
    username: string;
    rank: number;
    elo: number;
    league: string;
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

