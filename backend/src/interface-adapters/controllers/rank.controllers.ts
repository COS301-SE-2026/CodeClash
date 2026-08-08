import { Request, Response } from "express";
import { LeaderboardSystem } from "src/application/usecases/services/leaderboard.service";


export const getUserRank = (service: LeaderboardSystem) => {
    return async(req: Request, res: Response) => {
        try{
            const userId = req.user?.id //after checking auth.service.ts, this id value is the same as user_id
            
            if
        }
        catch(error){
            res.status(500).json({message: `Error getting user rank. Error: ${error}`})
        }
    };
}