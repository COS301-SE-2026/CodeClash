import { ProgSubmissionDTO } from "src/entities/dtos/components.dto";
import { MarkingStrategy } from "src/application/interfaces/marking/IMarkingStategy";
import { ExecutionResult, ICodeExecutor } from "src/application/interfaces/marking/ICodeExecutor";
import { NotificationDTO, NotificationTypes } from "src/entities/dtos/notification.dto";

export class MarkProg implements MarkingStrategy {

    private readonly executor;

    constructor(code_executor: ICodeExecutor){
        this.executor = code_executor;
    }

    async mark(submission: ProgSubmissionDTO, answer: string): Promise<NotificationDTO> {

        const result: ExecutionResult = await this.executor.execute(submission.source_code, submission.language_id, submission.source_code, answer);

        switch(result.status_id){
            case 1: // submission is queued
            const queued : NotificationDTO = {
                message : 'Submitted',
                type: NotificationTypes.Info
            }

            return queued;

            case 2: // submission is being marked
            break;

            case 3: // answer is correct 
            break;

            case 4: // answer is wrong
            break;

            case 5: // execution timed out
            break;

            case 6: // compilation error 
            break; 

            // Runtime Errors
            case 7:
            case 8:
            case 9:
            case 10: 
            case 11:
            case 12:
            break;            
        }
        
    }
}