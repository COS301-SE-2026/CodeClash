import { Request, Response } from 'express';
import { MatchHistoryRepository} from '../repositories/match-history.repository';
import { Match } from 'src/entities/ecs-entities';

export const getMatchHistory = (match_history_repo: MatchHistoryRepository) => {
    return async (req: Request, res: Response) => {

        try{
            const user_id = req.user.id;
            const matches = await match_history_repo.getMatchHistory(user_id);
            res.status(200).json(matches);
        }catch (error){
            console.error('Error fetching match history:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };
};

export const getMatchDetails = (match_history_repo: MatchHistoryRepository) => {
    return async (req: Request, res: Response) => {
        const match_id = req.params['match_id'] as string;
        const user_id = req.user.id;

        if(!match_id){
            res.status(400).json({ message: 'match ID is required' });
            return;
        }

        try{
            const details = await match_history_repo.getMatchDetails(match_id, user_id);
            res.status(200).json(details);
        }catch (error){
            console.error('Error fetching match details:', error );
            res.status(404).json({ message: 'Match not found' });
        }

    };

};