import { Request, Response } from "express";
import { LeaderboardSystem } from "src/application/usecases/systems/leaderboard.system";

export const getLeaderboardController = (useCase: LeaderboardSystem) => {
    return async (req: Request, res: Response) => {
      const limit = parseInt(req.query.limit as string) || 10
      const leaderboard = await useCase.execute(limit)
      res.status(200).json(leaderboard)
    };
}