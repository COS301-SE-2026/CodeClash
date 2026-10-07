import { SubmissionComponent } from "src/entities/components";

// mainly to try and figure out how long a user spends on a question, its just an estimate thats kept behind the interface in case it needs to change
// as there would probably be better ways to get this information down the line, trying to keep it modular so that i dont suffer too much innit

export interface IQuestionTiming {
    timeTaken(submissions: SubmissionComponent[], match_start: Date): Map<SubmissionComponent, number>;
}