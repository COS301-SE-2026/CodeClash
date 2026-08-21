import { Repository } from 'typeorm';
import { Achievement } from 'src/entities/db-entities/achievement.entities';
import { Users } from 'src/entities/db-entities/user.entities';
import { IAchievementRepository } from 'src/application/interfaces/repositories/IAchievementRepository';
import { AchievementDTO } from '../dtos/achievement.dto';

export class AchievementRepository implements IAchievementRepository {
    constructor(
        private readonly achievementRepo: Repository<Achievement>,
        private readonly userRepo: Repository<Users>
    ){}

    async getAllAchievements(): Promise<AchievementDTO[]> {
        
    }

    async getUserAchievements(user_id: string): Promise<AchievementDTO[]> {
        
    }

    async awardAchievement(user_id: string, achievement_id: string): Promise<void> {
        
    }

    async hasAchievement(user_id: string, achievement_id: string): Promise<boolean> {
        
    }

    async getAchievementByName(name: string): Promise<AchievementDTO | null> {
        
    }
    
}

