export interface AchievementDTO {
    achievement_id: string;
    achievement_name: string;
    description: string;
}

export interface UserAchievementsDTO {
    user_id: string;
    achievements: AchievementDTO[];
}