import { type MarkingResultDTO } from "src/dtos/match/submission.dto";
import { useEffect, useState } from "react";
import type { MathsSubmissionDTO, ProgSubmissionDTO } from "src/dtos/match/submission.dto";
import type { Question } from "src/Models/MatchModel";
import { useUser } from "src/context/User/hooks/useUser";
import { type SubmissionDTO } from "src/dtos/match/submission.dto";
import { useSocket } from "src/context/Socket/hooks/useSocket";
import type { MatchMode, MatchType } from "src/dtos/match/match.dto";

interface SubmissionProps {
    round_idx: number,
    curr_question: number,
    question: Question,
    match_id: string,
    updatePlayerLife: (player_id: string, life: number) => void
}

export const useSubmission = ({
    round_idx,
    curr_question,
    question,
    match_id,
    updatePlayerLife
}: SubmissionProps) => {
    const [results, setResults] = useState<(boolean | null)[][]>([]);
    const [lastResult, setLastResult] = useState<{ correct: boolean; id: number } | null>(null);
    const [marking, setMarking] = useState(false);
    const [markingError, setMarkingError] = useState<string | null>(null);
    const { userId } = useUser();
    const { matchSocket } = useSocket();

    const submissionResult = (result: MarkingResultDTO) => {
        setResults((prev) => {
            const next = [...prev];
            const round_results = [...(next[round_idx] ?? [])];
            round_results[curr_question] = result.correct;
            next[round_idx] = round_results;
            return next
        });

    }


    const submissionError = (error: string) => {
        console.error(error)
        setMarkingError(error);
    }

    const submitQuestion = async (data: MathsSubmissionDTO | ProgSubmissionDTO, match_type: MatchType, match_mode: MatchMode, tournament_id?: string) => {

        const submission: SubmissionDTO = {
            id: match_id,
            player_id: userId,
            question_id: question.id!,
            round_number: round_idx,
            question_number: curr_question,
            match_type: match_type,
            match_mode: match_mode,
            submission: data
        }

        setMarking(true);
        setMarkingError(null);

        // emit rejects when the server reports an error, so catch it here instead of leaving it unhandled
        try {
            let result;

            if (match_type === 'tournament') {
                result = await matchSocket?.submitAnswer({ ...submission, tournament_id: tournament_id });

            } else
                result = await matchSocket?.submitAnswer(submission);

            if (result !== undefined && result.ok) {
                updatePlayerLife(result.data!.player_id, result.data!.life_update);
                submissionResult(result.data!);
                setLastResult({ correct: result.data!.correct, id: Date.now() });
            }
            else {
                submissionError("Marking Error");
            }
        }
        catch (error) {
            submissionError(error instanceof Error ? error.message : "Marking Error");
        }
        finally {
            setMarking(false);
        }
    }




    return {
        results,
        lastResult,
        marking,
        markingError,
        submissionError,
        submissionResult,
        submitQuestion
    }

}


export function useAnswerResponse(lastResult: { correct: boolean, id: number } | null, currentQuestion: number) {
    const [colourClass, setColourClass] = useState('');

    useEffect(() => {
        setColourClass('');
    }, [currentQuestion]);


    useEffect(() => {
        if (!lastResult) return;
        setColourClass(lastResult.correct ? 'answer-correct' : 'answer-wrong');
    }, [lastResult]);

    return colourClass;
}

export function useLifeShake(lastResult: { correct: boolean, id: number } | null) {
    const [shaking, setShaking] = useState(false);

    useEffect(() => {
        if (!lastResult || lastResult.correct) return;

        setShaking(true);
        const timer = setTimeout(() => setShaking(false), 400);
        return () => clearTimeout(timer);
    }, [lastResult])

    return shaking
}