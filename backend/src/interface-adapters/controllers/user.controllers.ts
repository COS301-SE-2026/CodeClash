import { Request, Response } from 'express';
import { UserRepository } from '../repositories/interface-implementations/user.repository';
import { validStat } from '../auth/auth.service';
import { UserDTO } from 'src/entities/dtos/user.dto';


/// GET api/user/:stat
export const getUserStat = (user_repo: UserRepository) => {

    return async (req: Request, res: Response) => {

        const { stat } = req.params;

        if (!stat || typeof stat !== 'string' || !validStat(stat)) {
            res.status(400).json({ error: 'Invalid request' })
            return;
        }


        const data = await user_repo.getUserData(req.user.id, stat as keyof UserDTO);

        if (!data) {
            res.status(404).json({ error: 'User not found' })
            return;
        }

        res.status(200).json(data);
    }
    //    
}