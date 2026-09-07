import cors from 'cors'
import express, { Request, Response } from 'express'
import { requireAuth } from 'src/interface-adapters/auth/auth.service';
import { IEloRepository } from 'src/application/interfaces/repositories/IEloRepository';
import { IUserRepository } from 'src/application/interfaces/repositories/IUserRepository';

import { createAPIRoutes } from './api.routes';
import { LeaderboardService } from 'src/application/usecases/services/leaderboard.service';
import { AchievementService } from 'src/application/usecases/services/achievement.service';
import { FriendService } from 'src/application/usecases/services/friend.service';
import { MatchHistoryRepository } from 'src/interface-adapters/repositories/match-history.repository';


export const createApp = (
  elo_repo: IEloRepository,
  user_repo: IUserRepository,
 match_history_repo: MatchHistoryRepository,
  leaderboard_service: LeaderboardService,
  achievement_service: AchievementService,
  friends_service: FriendService
) => {
  const app = express();
  app.disable('x-powered-by');
  app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  app.use(cors({ origin: [process.env.FRONTEND_URL!, 'http://localhost:5173'] }));
  app.use(express.json());

  app.use(requireAuth(user_repo))
  app.use('/api', createAPIRoutes(elo_repo, user_repo,match_history_repo, leaderboard_service,achievement_service,friends_service));

  return app;
}

