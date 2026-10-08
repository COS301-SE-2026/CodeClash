import { Request, Response } from "express";
import { TournamentService } from "src/application/usecases/services/tournament/tournament.service";
import { MatchStatus } from "src/entities/dtos/matches/match.dto";

export const getTournamentByStatus = (service: TournamentService) => {
    return async (req: Request, res: Response) => {
    
            const { status } = req.params;

            if (!status || !Object.values(MatchStatus).includes(status as MatchStatus)) {

                res.status(400).json({ message: 'Invalid request' });
                return;
            }

            const tournaments = await service.getTournamentsByStatus(status as MatchStatus);
            res.status(200).json(tournaments);

        
    }
}
