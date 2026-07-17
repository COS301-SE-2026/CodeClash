import { Request, Response } from "express"
import { pool } from "src/config/db"
import { validToken, unauthorised } from "src/services/auth.service"

export const getQuestions = async(req:Request, res:Response): Promise<void> =>{
      const token = req.headers.authorization?.split(' ')[1];
    
      const user = await validToken(token);
    
      if (!user) {
        res.status(401).json(unauthorised('Missing or Invalid Token'));
        return;
      }
    
      const email = user.email;
    
}

