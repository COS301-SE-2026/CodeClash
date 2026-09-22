import { Request, Response } from 'express';
import { IUserRepository } from 'src/application/interfaces/repositories/IUserRepository';

// GET /api/elo/elo-get
// Get current elo rating for a user
export const getUserElo = (user_repo: IUserRepository) => {
  return async (req: Request, res: Response)=>{
      const elo = await user_repo.getUserData(req.user.id, 'elo');

      if(!elo){
        res.status(404).json({error: 'User not found'})
        return
      }

      res.status(200).json(elo);

  }
};
