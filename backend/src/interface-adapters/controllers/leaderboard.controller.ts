<<<<<<< HEAD
import { Request, Response } from "express";
import { LeaderboardService } from "src/application/usecases/services/leaderboard.service";

export const getLeaderboard = (useCase: LeaderboardService) => {
    return async (req: Request, res: Response) => {
      const limit = parseInt(req.query.limit as string) || 10
      const page = parseInt(req.query.page as string) || 1
      const leaderboard = await useCase.execute(limit, page)
      res.status(200).json(leaderboard)
    };
=======
import { Request, Response } from "express";
import { LeaderboardSystem } from "src/application/usecases/services/leaderboard.service";

export const getLeaderboardController = (useCase: LeaderboardSystem) => {
    return async (req: Request, res: Response) => {
      const limit = parseInt(req.query.limit as string) || 10
      const page = parseInt(req.query.page as string) || 1
      const leaderboard = await useCase.execute(limit, page)
      res.status(200).json(leaderboard)
    };
>>>>>>> 5378a30cd86c953bdc20aa94765d31b947e8a4e4
}