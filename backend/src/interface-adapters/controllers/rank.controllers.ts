import { Request, Response } from "express";
import { LeaderboardSystem } from "src/application/usecases/services/leaderboard.service";


export const getUserRank = (service: LeaderboardSystem) => {
    return async(req: Request, res: Response){
        
    }