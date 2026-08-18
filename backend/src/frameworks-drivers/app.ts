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


// app.use('/api/elo', routes);
// app.use('/api/match', routes);
// app.use('/api/user', routes);
// N.B. All the routes will automatically mount onto /api/. If routing problems show up this will need to be refactored
app.use('/api', routes);




export default app;
