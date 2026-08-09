import { Request, Response } from 'express';
import { MatchHistoryRepository} from '../repositories/match-history.repository';
import { AppDataSource } from 'src/frameworks-drivers/config/data-source';
import { Match, MatchLog } from 'src/entities/db-entities/match.entities';
import { MatchStats } from 'src/entities/db-entities/match-stats.entities'; 

const matchHistoryRepo = new MatchHistoryRepository(
    AppDataSource.getRepository(Match),
    AppDataSource.getRepository(MatchLog),
    AppDataSource.getRepository(MatchStats)
);

export const getMatchHistory = async (req: Request, res: Response): Promise<void> => {
    const user_id = req.params['user_id'] as string;

    if(!user_id){
        res.status(400).json({ message: 'user ID is required' });
        return;
    }

    try{
        const matches = await matchHistoryRepo.getMatchHistory(user_id);
        res.status(200).json(matches);
    }catch (error){
        console.error('Error fetching match history:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getMatchDetails = async (req: Request, res: Response): Promise<void> => {
    const match_id = req.params['match_id'] as string;
    const user_id = req.params['user_id'] as string;

    if(!match_id || !user_id){
        res.status(400).json({ message: 'match ID and user ID are required' });
        return;
    }

    try{
        const details = await matchHistoryRepo.getMatchDetails(match_id, user_id);
        res.status(200).json(details);
    }catch (error){
        console.error('Error fetching match details:', error );
        res.status(404).json({ message: 'Match not found' });
    }
};