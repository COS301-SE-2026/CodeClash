import { Request, Response } from "express";

export const handleMarkingResult = ()=>{
    return async(req: Request, res: Response)=>{
        const result = req.body;    // judge0 submission result

        if(result){
            res.status(200).json({})
        }
                
    }
}