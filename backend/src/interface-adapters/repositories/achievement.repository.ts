import { Repository } from 'typeorm';
import { Achievement} from 'src/entities/database/achievement.entities';
import { Users } from 'src/entities/database/user.entities';
import { IAchievementRepository } from 'src/application/interfaces/repositories/IAchievementRepository';
import { AchievementDTO } from 'src/entities/dtos/achievements/achievement.dto';

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
        const rows: { achievement_id: string; achievement_name: string; description: string;earned_at: Date }[] =
        await this.achievementRepo.query(
            `SELECT a.achievement_id, a.achievement_name, a.description, pa.earned_at
             FROM player_achievements pa
             JOIN achievements a ON a.achievement_id = pa.achievement_id
             WHERE pa.user_id = $1
             ORDER BY pa.earned_at DESC`,
             [user_id]
        );
        
        return rows.map(a => ({
            achievement_id: a.achievement_id,
            achievement_name: a.achievement_name,
            description: a.description,
            earned_at: a.earned_at
        }));
    }

    async awardAchievement(user_id: string, achievement_id: string): Promise<void> {
        const already = await this.hasAchievement(user_id, achievement_id);
        if (already) return;

        await this.userRepo.createQueryBuilder()
        .relation(Users, 'achievements')
        .of(user_id)
        .add(achievement_id)
    }

    async hasAchievement(user_id: string, achievement_id: string): Promise<boolean> {
        const user = await this.userRepo.findOne({
            where: { user_id },
            relations: { achievements: true }
        });
        return user?.achievements?.some(a => a.achievement_id === achievement_id) ?? false;
    }

    async getAchievementByName(name: string): Promise<AchievementDTO | null> {
        const achievement = await this.achievementRepo.findOne({
            where: { achievement_name: name }
        });
        if (!achievement) return null;
        return {
            achievement_id: achievement.achievement_id,
            achievement_name: achievement.achievement_name,
            description:  achievement.description
        };
    }
    
}

