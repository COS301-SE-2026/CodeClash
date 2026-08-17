import cors from 'cors'
import express, { Request, Response } from 'express'
import { LeaderboardSystem } from 'src/application/usecases/services/leaderboard.service';
import { EloRatings } from 'src/entities/db-entities/elo.entities';
import { Users } from 'src/entities/db-entities/user.entities';
import { requireAuth } from 'src/interface-adapters/auth/auth.service';
import { getLeaderboardController } from 'src/interface-adapters/controllers/leaderboard.controller';
import { EloRepository } from 'src/interface-adapters/repositories/elo.repository';
import { UserRepository } from 'src/interface-adapters/repositories/user.repository';

import { AppDataSource } from './config/data-source';
import routes from './routes/api.routes';

const app = express();
app.disable('x-powered-by');
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

const elo_repo = new EloRepository(AppDataSource.getRepository(EloRatings))
const leaderboard_system = new LeaderboardSystem(elo_repo);
app.get('/api/elo/leaderboard', getLeaderboardController(leaderboard_system));

const user_repo = new UserRepository(AppDataSource.getRepository(Users))
app.use(requireAuth(user_repo))


app.use('/api/elo', routes);
app.use('/api/match', routes);
app.use('/api/user', routes);
app.use('/api/qustion', routes);




export default app;
