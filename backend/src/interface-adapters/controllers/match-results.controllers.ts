import { Request, Response } from 'express';
import { MatchResultService } from 'src/application/usecases/services/match-result.service';

export const getMatchResults = (service: MatchResultService) => {
    return async (req: Request, res: Response) => {
        
        const match_id = req.params['match_id'] as string;

        if (!match_id) {
            res.status(400).json({ message: "match ID is required" });
            return;
        }

        try {
            const result = await service.getMatchResult(match_id);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error fetching match results: ', error);
            res.status(404).json({ message: 'Results not ready' });
        }
    };
}
