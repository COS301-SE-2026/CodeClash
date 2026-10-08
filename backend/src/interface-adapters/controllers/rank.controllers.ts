import { Request, Response } from "express";
import { LeaderboardService } from "src/application/usecases/services/leaderboard.service";


export const getUserRank = (service: LeaderboardService) => {
    return async (req: Request, res: Response) => {
            const userId = req.user?.id //after checking auth.service.ts and the other controllers, this id value is the same as user_id

            if (!userId) {
                res.status(401).json({ message: "Unauthorised" });
                return;
            }

            const rank = await service.getUserRank(userId);

            if (!rank) {
                res.status(404).json({ message: "Rank not found" });
                return;
            }

            res.status(200).json(rank);

        
    };
}