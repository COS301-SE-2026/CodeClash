import { Request, Response } from 'express';

<<<<<<< HEAD
import { IEloRepository } from 'src/application/interfaces/repositories/IEloRepository';

=======
>>>>>>> 5378a30cd86c953bdc20aa94765d31b947e8a4e4
// GET /api/elo/elo-get
// Get current elo rating for a user
export const getUserElo = (elo_repo: IEloRepository) => {
  return async (req: Request, res: Response)=>{
      const elo = await elo_repo.getElo(req.user.id);

      if(!elo){
        res.status(404).json({error: 'User not found'})
        return
      }

      res.status(200).json(elo);

  }
};
