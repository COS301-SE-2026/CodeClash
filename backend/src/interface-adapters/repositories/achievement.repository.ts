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
        const achievements = await this.achievementRepo.find();
        return achievements.map(a => ({
            achievement_id: a.achievement_id,
            achievement_name: a.achievement_name,
            description: a.description
        }));
    }

    async getUserAchievements(user_id: string): Promise<AchievementDTO[]> {
        const user = await this.userRepo.findOne({
            where: { user_id },
            relations: { achievements: true }
        });
        if (!user || !user.achievements) return [];
        return user.achievements.map(a => ({
            achievement_id: a.achievement_id,
            achievement_name: a.achievement_name,
            description: a.description
        }));
    }

    async awardAchievement(user_id: string, achievement_id: string): Promise<void> {
        const already = await this.hasAchievement(user_id, achievement_id);
        if (already) return;

        const user = await this.userRepo.findOne({
            where: { user_id },
            relations: { achievements: true }
        });
        const achievement = await this.achievementRepo.findOne({ where: { achievement_id }});

        if(!user || !achievement) throw new Error('User or achievement not found');

        user.achievements = [...(user.achievements ?? []), achievement];
        await this.userRepo.save(user);
    }

    async hasAchievement(user_id: string, achievement_id: string): Promise<boolean> {
        
    }

    async getAchievementByName(name: string): Promise<AchievementDTO | null> {
        
    }
    
}

