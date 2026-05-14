import express, { Request, Response } from 'express'
import cors from 'cors'

const app = express();
app.disable('x-powered-by');    //so express version isn't included in responses

app.use(cors({origin: process.env.FRONTEND_URL || 'http://localhost:5173'}));
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok'});
});

export default app;