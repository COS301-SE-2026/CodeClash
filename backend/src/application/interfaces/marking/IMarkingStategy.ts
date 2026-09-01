import { MathsSubmissionDTO, ProgSubmissionDTO } from "src/entities/dtos/components.dto";
import { NotificationDTO } from "src/entities/dtos/notification.dto";

export interface MarkingStrategy{
    mark(submission: MathsSubmissionDTO | ProgSubmissionDTO, answer: string | string): Promise<NotificationDTO>;
}