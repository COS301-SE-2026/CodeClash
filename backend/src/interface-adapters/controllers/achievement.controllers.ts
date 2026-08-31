import { Request, Response } from "express";
import { AchievementService } from "src/application/usecases/services/achievement.service";

export const getAllAchievements = (service: AchievementService) =>
    async (req: Request, res: Response): Promise<void> => {
        try{
            const achievements = await service.getAllAchievements();
            res.status(200).json(achievements);
        }catch (error) {
            console.error('Error fetching achievements:',  error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

// copied structure
export const getUserAchievements = (service: AchievementService) => 
    async (req: Request, res: Response): Promise<void> => {
        const user_id = req.user?.id;
        if(!user_id){
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        try{
            const achievements = await service.getUserAchievements(user_id);
            res.status(200).json(achievements);
        }catch (error) {
            console.error("Error fetching user achievements:", error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    