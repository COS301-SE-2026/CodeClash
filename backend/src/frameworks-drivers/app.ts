import cors from 'cors'
import { requireAuth } from 'src/interface-adapters/auth/auth.service'
import express, { Request, Response } from 'express'
import { IUserRepository } from 'src/application/interfaces/repositories/IUserRepository';

import { createAPIRoutes } from './api.routes';
import { LeaderboardService } from 'src/application/usecases/services/leaderboard.service';
import { AchievementService } from 'src/application/usecases/services/achievement.service';
import { FriendService } from 'src/application/usecases/services/friend.service';
import { MatchCompletionService } from 'src/application/usecases/services/match/match-completion.service';


export const createApp = (
  user_repo: IUserRepository,
  leaderboard_service: LeaderboardService,
  achievement_service: AchievementService,
  friends_service: FriendService,
  match_completion_service: MatchCompletionService
) => {
  const app = express();
  app.disable('x-powered-by');
  app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  app.use(cors({ origin: [process.env.FRONTEND_URL!, 'http://localhost:5173'] }));
  app.use(express.json());

  // app.use(requireAuth(user_repo))
  app.use((req, res, next) =>
    req.path === '/api/create-user' ? next() : requireAuth(user_repo)(req, res, next)
  );
  app.use('/api', createAPIRoutes(user_repo,leaderboard_service,achievement_service,friends_service, match_completion_service));

  return app;
}

