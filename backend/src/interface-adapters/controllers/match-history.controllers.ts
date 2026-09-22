import { Request, Response } from 'express';
import { IMatchRepository } from 'src/application/interfaces/repositories/IMatchRepository';

export const getMatchHistory = (match_repo: IMatchRepository) => {
    return async (req: Request, res: Response) => {

        try{
            const user_id = req.user.id;
            const matches = await match_repo.getMatchHistory(user_id);
            res.status(200).json(matches);
        }catch (error){
            console.error('Error fetching match history:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };
};
