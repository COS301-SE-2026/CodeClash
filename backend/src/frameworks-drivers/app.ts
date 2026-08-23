import cors from 'cors'
import express, { Request, Response } from 'express'

import routes from './api.routes';

const app = express();
app.disable('x-powered-by');
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use(cors({ origin:[ process.env.FRONTEND_URL!]}));
app.use(express.json());

app.use('/api/elo', routes);
app.use('/api/match', routes);
app.use('/api/user', routes);
app.use('/api/qustion', routes);
app.use('/api/leaderboard', routes);

export default app;
