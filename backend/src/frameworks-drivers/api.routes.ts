import { Router } from 'express';
import { getUserElo } from 'src/interface-adapters/controllers/elo.controllers';
import { createUser, getUserStat } from 'src/interface-adapters/controllers/user.controllers';

import { LeaderboardService } from 'src/application/usecases/services/leaderboard.service';
import { getLeaderboard } from 'src/interface-adapters/controllers/leaderboard.controller';
import { CreateUser } from 'src/application/usecases/services/user-creation.service';
import { creationRequireAuth, requireAuth } from 'src/interface-adapters/auth/auth.service';

import { getUserRank } from 'src/interface-adapters/controllers/rank.controllers';
import { IEloRepository } from 'src/application/interfaces/repositories/IEloRepository';
import { IUserRepository } from 'src/application/interfaces/repositories/IUserRepository';

export const createAPIRoutes = (
  elo_repo: IEloRepository,
  user_repo: IUserRepository,
  leaderboard_service: LeaderboardService
) => {
  const router = Router();


  const create_user_service = new CreateUser(user_repo, elo_repo);
 
  router.post('/create-user', creationRequireAuth(), createUser(create_user_service));


  router.use(requireAuth(user_repo));

  // elo routes
  router.get('/elo/elo-get', getUserElo(elo_repo));
  router.get("/leaderboard-get", getLeaderboard(leaderboard_service));


  // user routes
  router.get('/user/rank', getUserRank(leaderboard_service));
  router.get('/user/:stat', getUserStat(user_repo)); // this must be last, it's a generic function that fetches any attribute directly in the users table

  return router;
}
