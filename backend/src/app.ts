import express, { Request, Response } from 'express'
import cors from 'cors'

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok'});
});

module.exports = app;