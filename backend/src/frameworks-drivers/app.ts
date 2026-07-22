import cors from 'cors'
import express, { Request, Response } from 'express'
import routes from './routes/api.routes';
import { UserRepository } from 'src/interface-adapters/repositories/interface-implementations/user.repository';
import { AppDataSource } from './data-source';
import { User } from 'src/interface-adapters/repositories/db-entities/user.entities';
import { requireAuth } from 'src/interface-adapters/auth/auth.service';

const app = express();
app.disable('x-powered-by');

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use('/api/elo', routes);
app.use('/api/match', routes);
app.use('/api/user',routes);
app.use('/api/qustion',routes);

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

const user_repo = new UserRepository(AppDataSource.getRepository(User))
app.use(requireAuth(user_repo))


export default app;