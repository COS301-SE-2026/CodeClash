import cors from 'cors'
import express, { Request, Response } from 'express'
import routes from './routes/api.routes';

const app = express();
app.disable('x-powered-by');
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

// N.B. Might have to refactor routes to mount only onto api/ for clealiness
app.use('/api/elo', routes);
app.use('/api/match', routes);
app.use('/api/user', routes);
app.use('/api/qustion', routes);
app.use('/api', routes);




export default app;
