import cors from 'cors'
import express, { Request, Response } from 'express'
import { requireAuth } from 'src/interface-adapters/auth/auth.service';
import { IEloRepository } from 'src/application/interfaces/repositories/IEloRepository';
import { IUserRepository } from 'src/application/interfaces/repositories/IUserRepository';

import { createAPIRoutes } from './routes/api.routes';
import { LeaderboardService } from 'src/application/usecases/services/leaderboard.service';


export const createApp = (
  elo_repo: IEloRepository,
  user_repo: IUserRepository,
  leaderboard_service: LeaderboardService
) => {
  const app = express();
  app.disable('x-powered-by');
  app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  app.use(cors({ origin: [process.env.FRONTEND_URL!, 'http://localhost:5173'] }));
  app.use(express.json());

  app.use(requireAuth(user_repo))
  app.use('/api', createAPIRoutes(elo_repo, user_repo, leaderboard_service));

  return app;
}

