import { Request, Response } from 'express';
import { UserDTO } from 'src/entities/dtos/user.dto';

import { validStat } from '../auth/auth.service';
import { UserRepository } from '../repositories/user.repository';
import { CreateUser } from 'src/application/usecases/services/user-creation.service';


/// GET api/user/:stat
export const getUserStat = (user_repo: UserRepository) => {

    return async (req: Request, res: Response) => {

        const { stat } = req.params;

        if (!stat || typeof stat !== 'string' || !validStat(stat)) {
            res.status(400).json({ message: 'Invalid request' })
            return;
        }
        const data = await user_repo.getUserData(req.user.id, stat as keyof UserDTO);
    
        if (!data) {
            res.status(404).json({ message: 'User not found' })
            return;
        }

        res.status(200).json(data);
    }
    //    
}


export const createUser = (create_user: CreateUser) => {
    return async (req: Request, res: Response) => {
        const email: string = req.body.email;
        const username: string = req.body.username;

        if ((!email || email.trim().length === 0) || (!username || username.trim().length === 0)) {
            res.status(404).json({ message: "Missing paramaters" });
            return;
        }

        try {
            create_user.create(username, email);
            res.status(200);
        }
        catch (error) {
            res.status(400).json({ message: error });
        }
    }
}