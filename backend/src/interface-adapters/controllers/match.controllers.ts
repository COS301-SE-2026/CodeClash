import { Request, Response } from "express";
import { MatchCompletionService } from "src/application/usecases/services/match/match-completion.service";

export const getMatchResults = (service: MatchCompletionService) => {
    return async (req: Request, res: Response) => {
        
        const match_id = req.params['match_id'] as string;

        if (!match_id) {
            res.status(400).json({ message: "match ID is required" });
            return;
        }

        try {
            const result = await service.getMatchResults(match_id);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error fetching match results: ', error);
            res.status(404).json({ message: 'Results not ready' });
        }
    };
};


export const getMatchHistory = (service: MatchCompletionService) => {
    return async (req: Request, res: Response) => {

        try{
            const user_id = req.user.id;
            const matches = await service.getMatchHistory(user_id);
            res.status(200).json(matches);
        }catch (error){
            console.error('Error fetching match history:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };
};

export const getSkillProgress = (service: MatchCompletionService) => {
    return async (req: Request, res: Response) => {
        const user_id = req.user.id;
        try {
            const games = await service.getSkillProgress(user_id);
            res.status(200).json(games);
        } catch (error) {
            console.error('Error fetching skill progress:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };
};