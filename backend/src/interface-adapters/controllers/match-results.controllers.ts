import { Request, Response } from 'express';
import { MatchResultService } from 'src/application/usecases/services/match-result.service';
import { EloRepository } from '../repositories/elo.repository';
import { MatchResultRepository } from '../repositories/match-result.repository';

const service = new MatchResultService(new EloRepository(), new MatchResultRepository());

export const getMatchResults = async (req: Request, res: Response ): Promise<void> => {
    const {match_id } = req.params;

    try{
        const result = await service.finaliseMatch(match_id);
    }
}
