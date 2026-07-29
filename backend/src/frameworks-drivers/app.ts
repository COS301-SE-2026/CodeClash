import cors from 'cors'
import express, { Request, Response } from 'express'
import { requireAuth } from 'src/interface-adapters/auth/auth.service';
import { IUserRepository } from 'src/application/interfaces/repositories/IUserRepository';
import routes from './routes/api.routes';


export function createApp(user_repo: IUserRepository) {

  const app = express();
  app.disable('x-powered-by');
  app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:4444' }));
  app.use(express.json());
  app.use(requireAuth(user_repo))


  app.use('/api/elo', routes);
  app.use('/api/match', routes);
  app.use('/api/user', routes);
  app.use('/api/qustion', routes);

  return app;
}

