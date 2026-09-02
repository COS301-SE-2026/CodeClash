import { AchievementDTO } from "src/interface-adapters/dtos/achievement.dto";

export interface IAchievementRepository {
    getAllAchievements(): Promise<AchievementDTO[]>;
    getUserAchievements(user_id: string): Promise<AchievementDTO[]>
    awardAchievement(user_id: string, achievement_id: string): Promise<void>;
    hasAchievement(user_id: string, achievement_id: string): Promise<boolean>;
    getAchievementByName(name: string): Promise< AchievementDTO | null>;
}