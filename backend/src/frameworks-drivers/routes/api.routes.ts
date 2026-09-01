import { Router } from 'express';
import { getUserElo } from 'src/interface-adapters/controllers/elo.controllers';
import { getUserStat } from 'src/interface-adapters/controllers/user.controllers';
import { IEloRepository } from 'src/application/interfaces/repositories/IEloRepository';
import { IUserRepository } from 'src/application/interfaces/repositories/IUserRepository';
import { LeaderboardService } from 'src/application/usecases/services/leaderboard.service';
import { getLeaderboardController } from 'src/interface-adapters/controllers/leaderboard.controller';

export const createAPIRoutes = (
  elo_repo: IEloRepository,
  user_repo: IUserRepository,
  leaderboard_service: LeaderboardService
) => {

  const router = Router();

  // elo
  router.get('/elo/elo-get', getUserElo(elo_repo));
  router.get('/elo/leaderboard', getLeaderboardController(leaderboard_service));

  // user
  router.get('/user/:stat', getUserStat(user_repo));


  return router;

}
