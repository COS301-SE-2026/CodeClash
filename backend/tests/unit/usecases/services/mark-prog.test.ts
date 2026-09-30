import { describe, expect, it, vi } from 'vitest'
import { MarkProg } from '../../../../src/application/usecases/services/marking/mark-prog'
import { PlayerSubmissionDTO, ProgSubmissionDTO } from '../../../../src/entities/dtos/submissions/submission.dto'
import { AnswerDTO } from '../../../../src/entities/dtos/questions/answer.dto'
import { MatchMode } from '../../../../src/entities/dtos/matches/match.dto'



const submission: PlayerSubmissionDTO = {
    match_id: 1,
    match_mode: MatchMode.Programming,
    player_id: 'player-1',
    question_id: 'q1',
    round_number: 3,
    submission: {
        source_code: 'source-code-01',
        language_id: 1,
        stdin: null
    }
}

const answer: AnswerDTO = {
    answer: 'correct-answer-01',
    question_id: 'q1',
    format: null,
    precision: null
}

describe('Testing Programming Marker', () => {

    const executor = {
        execute: vi.fn().mockResolvedValue({
            stdout: "hello, Judge0\n",
            time: "0.001",
            memory: 376,
            stderr: null,
            token: "8531f293-1585-4d36-a34c-73726792e6c9",
            compile_output: null,
            message: null,
            status: {
                id: 3,
                description: "Accepted"
            }
        })
    };

    const question_repo = {
        getTestCases: vi.fn().mockResolvedValue([
            { input: '{"sides":[2,2,2]}', expected_output: 'true' }
        ])
    }
    it("Sends test to code executor", async () => {

        const prog_marker = new MarkProg(executor, question_repo);

        const result = await prog_marker.mark(submission);

        expect(question_repo.getTestCases).toHaveBeenCalledWith('q1');
        expect(executor.execute).toHaveBeenCalledWith('source-code-01', 1, '2,2,2', 'true');
        expect(result).toBe(true);
    })

    it('returns false when the executor reports wrong answer', async () => {
        executor.execute.mockResolvedValueOnce({
            status: {
                id: 4,
                description: 'Wrong Answer'
            }
        })

        const result = await new MarkProg(executor , question_repo).mark(submission);
        expect(result).toBe(false);
    })
})