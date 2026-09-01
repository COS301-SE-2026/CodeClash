// import { ProgSubmissionDTO } from "src/entities/dtos/components.dto";
// import { MarkingStrategy } from "src/application/interfaces/marking/IMarkingStategy";
// import { ExecutionResult, ICodeExecutor } from "src/application/interfaces/marking/ICodeExecutor";
// import { NotificationDTO, NotificationTypes } from "src/entities/dtos/notification.dto";

// export class MarkProg implements MarkingStrategy {

//     private readonly executor;

//     constructor(code_executor: ICodeExecutor) {
//         this.executor = code_executor;
//     }

//     // async mark(submission: ProgSubmissionDTO, answer: string): Promise<NotificationDTO> {

//     //     const result = await this.executor.execute(submission.source_code, submission.language_id, submission.source_code, answer);

//     //     // switch (result.status.id) {
//     //     //     case 1: // submission is queued
//     //     //         const queued: NotificationDTO = {
//     //     //             message: 'Submitted.',
//     //     //             type: NotificationTypes.Info
//     //     //         }

//     //     //         return queued;

//     //     //     case 2: // submission is being marked
//     //     //         const pending: NotificationDTO = {
//     //     //             message: 'Marking...',
//     //     //             type: NotificationTypes.Info
//     //     //         }
//     //     //         return pending;

//     //     //     case 3: // answer is correct 
//     //     //         const correct: NotificationDTO = {
//     //     //             message: "Correct!",
//     //     //             type: NotificationTypes.Success
//     //     //         }
//     //     //         return correct;

//     //     //     case 4: // answer is wrong
//     //     //         const wrong: NotificationDTO = {
//     //     //             message: 'Incorrect!',
//     //     //             type: NotificationTypes.Error
//     //     //         }
//     //     //         return wrong;

//     //     //     case 5: // execution timed out
//     //     //     case 6: // compilation error 
//     //     //         const error: NotificationDTO = {
//     //     //             message: "Execution Error!",
//     //     //             type: NotificationTypes.Error
//     //     //         }
//     //     //         return error;

//     //     //     // Runtime Errors
//     //     //     default:
//     //     //         const runtime_errors: NotificationDTO = {
//     //     //             message: result.status.description,
//     //     //             type: NotificationTypes.Error
//     //     //         }
//     //     //         return runtime_errors;


//     //     // }

//     // }
// }