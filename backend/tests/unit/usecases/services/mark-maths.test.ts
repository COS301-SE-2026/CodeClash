import { describe, expect, it } from "vitest";
import { MarkMaths } from '../../../../src/application/usecases/services/marking/mark-maths';
import { MarkerRegistry } from "../../../../src/application/usecases/services/marking/maths-marking/marker-registry";
import { AnswerFormat } from "../../../../src/entities/dtos/questions/answer.dto";
import { randomUUID } from "node:crypto";
import { type MatchCache } from '../../../../src/interface-adapters/cache/match-cache'
import { PlayerSubmissionDTO } from "../../../../src/entities/dtos/submissions/submission.dto";
import { MatchMode } from "../../../../src/entities/dtos/matches/match.dto";

const mock_answers = [
    {
        answer: '42',
        question_id: randomUUID(),
        format: AnswerFormat.Numeric,
        precision: null
    },
    {
        answer: '1.45',
        question_id: randomUUID(),
        format: AnswerFormat.Decimal,
        precision: null
    },
    {
        answer: '(x+2)(y+2)',
        question_id: randomUUID(),
        format: AnswerFormat.Factored,
        precision: null
    },
    {
        answer: 'y=2x+4',
        question_id: randomUUID(),
        format: AnswerFormat.Equation,
        precision: null
    },

    {
        answer: '2x+4',
        question_id: randomUUID(),
        format: AnswerFormat.Expression,
        precision: null
    },
    {
        answer: 'bad format',
        question_id: randomUUID(),
        format: 'invalid format',
        precision: null
    }
]


const registry = new MarkerRegistry();
const cache = {
    getAnswer: async (question_id: string) => mock_answers.find((q) => q!.question_id === question_id) ?? null
} as any as MatchCache;
const marker = new MarkMaths(registry, cache);

describe("Testing Maths Marker", () => {
    it("throws on an unknown question id", async () => {

        const submission: PlayerSubmissionDTO = {
            match_id: 1,
            match_mode: MatchMode.Maths,
            player_id: randomUUID(),
            question_id: randomUUID(),
            round_number: 1,
            question_number: 1,
            submission: {
                answer: '12'
            }
        }
        await expect(marker.mark(submission)).rejects.toThrow('Invalid question id');
    })

    it("rejects submission without an answer", async () => {
        const submission = {
            match_id: 1,
            match_mode: MatchMode.Maths,
            player_id: randomUUID(),
            question_id: mock_answers[0]!.question_id,
            round_number: 1,
            question_number: 1
        }

        const result = await marker.mark(submission);
        expect(result.correct).toBe(false);
    })

    it("returns incorrect for unrecognized formats", async () => {
        const answer = mock_answers.find((a) => a.answer === 'bad format');

        const submission: PlayerSubmissionDTO = {
            match_id: 1,
            match_mode: MatchMode.Maths,
            player_id: randomUUID(),
            question_id: answer!.question_id,
            round_number: 1,
            question_number: 1,
            submission: {
                answer: '12'
            }
        }

        const result = await marker.mark(submission);
        expect(result.correct).toBe(false)
    })

    it("dispatches to the specific markers", async () => {
        const numeric_submission: PlayerSubmissionDTO = {
            match_id: 1,
            match_mode: MatchMode.Maths,
            player_id: randomUUID(),
            question_id: mock_answers[0]!.question_id,
            round_number: 1,
            question_number: 1,
            submission: {
                answer: mock_answers[0]!.answer
            }
        }

        const decimal_submission: PlayerSubmissionDTO = {
            match_id: 1,
            match_mode: MatchMode.Maths,
            player_id: randomUUID(),
            question_id: mock_answers[1]!.question_id,
            round_number: 1,
            question_number: 1,
            submission: {
                answer: mock_answers[1]!.answer
            }
        }

        const factored_submission: PlayerSubmissionDTO = {
            match_id: 1,
            match_mode: MatchMode.Maths,
            player_id: randomUUID(),
            question_id: mock_answers[2]!.question_id,
            round_number: 1,
            question_number: 1,
            submission: {
                answer: mock_answers[2]!.answer
            }
        }

        const equation_submission: PlayerSubmissionDTO = {
            match_id: 1,
            match_mode: MatchMode.Maths,
            player_id: randomUUID(),
            question_id: mock_answers[3]!.question_id,
            round_number: 1,
            question_number: 1,
            submission: {
                answer: mock_answers[3]!.answer
            }
        }

        const expression_submission: PlayerSubmissionDTO = {
            match_id: 1,
            match_mode: MatchMode.Maths,
            player_id: randomUUID(),
            question_id: mock_answers[4]!.question_id,
            round_number: 1,
            question_number: 1,
            submission: {
                answer: mock_answers[4]!.answer
            }
        }

        expect(await marker.mark(numeric_submission)).toEqual({ correct: true });
        expect(await marker.mark(decimal_submission)).toEqual({ correct: true });
        expect(await marker.mark(factored_submission)).toEqual({ correct: true });
        expect(await marker.mark(equation_submission)).toEqual({ correct: true });
        expect(await marker.mark(expression_submission)).toEqual({ correct: true });
    })
})