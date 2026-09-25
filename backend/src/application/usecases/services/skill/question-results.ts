import { IQuestionTiming } from "src/application/interfaces/skill/IQuestionTiming";
import { SubmissionComponent } from "src/entities/components";
import { RoundDTO } from "src/entities/dtos/matches/match-component.dto";
import { MatchMode, QuestionResult } from "src/entities/dtos/matches/match.dto";
import { QuestionDTO } from "src/entities/dtos/questions/question.dto";
import { PreviousAnswerTiming } from "./previous-answer-timing";
import { referenceRuntimeMs } from "./reference-runtimes";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

// time limit is postgres time innit

export const timeLimitMs = (time_limit: string): number => {
  const [hours = 0, minutes = 0, seconds = 0] = time_limit.split(':').map(Number);
  return ((hours * 60 + minutes) * 60 + seconds) * 1000;
};

export class QuestionResultBuilder {
  constructor(private readonly timing: IQuestionTiming = new PreviousAnswerTiming()) { }

  build(rounds: RoundDTO[], submissions: SubmissionComponent[], match_start: Date): QuestionResult[] {
         const times = this.timing.timeTaken(submissions, match_start);
 
         const by_question = new Map<string, SubmissionComponent>();
         for (const submission of submissions) {
             by_question.set(`${submission.round_number}::${submission.question_id}`, submission);
         }
 
         // every question the player was given gets a result, unanswered ones score zero
         return rounds.flatMap(round => round.questions.map(question => {
             const submission = by_question.get(`${round.round_number}::${question.id}`);
             return this.result(round.round_number, question, submission, submission ? times.get(submission) : undefined);
         }));
  }

  
}