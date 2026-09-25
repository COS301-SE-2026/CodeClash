import { IQuestionTiming } from "src/application/interfaces/skill/IQuestionTiming";
import { SubmissionComponent } from "src/entities/components";
import { RoundDTO } from "src/entities/dtos/matches/match-component.dto";
import { MatchMode, QuestionResult } from "src/entities/dtos/matches/match.dto";
import { QuestionDTO } from "src/entities/dtos/questions/question.dto";
import { PreviousAnswerTiming } from "./previous-answer-timing";
import { referenceRuntimeMs } from "./reference-runtimes";
