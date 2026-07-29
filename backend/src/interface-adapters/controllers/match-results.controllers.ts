import { Request, Response } from 'express';
import { MatchResultService } from 'src/application/usecases/services/match-result.service';
import { EloRepository } from '../repositories/elo.repository';
import { MatchResultRepository } from '../repositories/match-result.repository';
import { AppDataSource } from 'src/frameworks-drivers/config/data-source';
import { EloRatings } from 'src/entities/db-entities/elo.entities';
import { Match, MatchLog } from 'src/entities/db-entities/match.entities';
import { Users } from 'src/entities/db-entities/user.entities';

const eloRepository = new EloRepository(AppDataSource.getRepository(EloRatings));
const matchResultRepository = new MatchResultRepository(
    AppDataSource.getRepository(MatchLog),
    AppDataSource.getRepository(Users),
    AppDataSource.getRepository(Match)
);
const service = new MatchResultService(eloRepository, matchResultRepository);

export const getMatchResults = async (req: Request, res: Response ): Promise<void> => {
    const  match_id  = req.params['match_id'] as string;

    if (!match_id) {
        res.status(400).json({message: "match ID is required"});
        return;
    }

    try{
        const result = await service.getMatchResult(match_id);
        res.status(200).json(result);
    }catch (error){
        console.error('Error fetching match results: ', error);
        res.status(404).json({message: 'Results not ready'});
    }
};
