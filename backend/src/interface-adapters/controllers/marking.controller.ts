import { Request, Response } from "express";
import { MarkingService } from "src/application/usecases/services/marking/marking.service";

export const handleMarkingResult = (marking_service: MarkingService)=>{
    return async(req: Request, res: Response)=>{
        const result = req.body;    // judge0 submission result

        try{
           // await marking_service.execute()
           // TODO: update and marking strategy 
        }
        catch(error){
            console.error("Marking Error", error);
            res.status(500).json({message: "Internal Server Error"});
            return;
        }
                
    }
}