import { Request, Response } from "express";
import { MarkingService } from "src/application/usecases/services/marking/marking.service";
import { SubmissionSystem } from "src/application/usecases/systems/submission.system";
import { CompleteSubmissionResult } from "src/entities/dtos/submission-result.dto";

export const handleMarkingResult = (marking_service: MarkingService, submission_system: SubmissionSystem) => {
    return async (req: Request, res: Response) => {
        const result = req.body;    // judge0 submission result

        try {
            const submission = submission_system.getSubmissionByToken(result.token);

            if (!submission) { 
                res.status(404).send();
                return;
            }

            const correct = result.satus.id === 3;

            const complete_submission: CompleteSubmissionResult = {
                status: 'complete',
                question_id: submission.question_id,
                correct: correct,
                speed: (submission.submitted_at!.getTime() - submission.started_at!.getTime()).toString(),
                message: result.status.descripion
            }

            marking_service.handleResult(complete_submission, submission);
            res.status(200).send()

        }
        catch (error) {
            console.error("Marking Error", error);
            res.status(500).json({ message: "Internal Server Error" });
            return;
        }

    }
}