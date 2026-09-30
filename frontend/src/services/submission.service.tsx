import { type MarkingResultDTO } from "src/dtos/match/submission.dto";
import { useEffect, useState } from "react";
import type { MathsSubmissionDTO, ProgSubmissionDTO } from "src/dtos/match/submission.dto";
import type { Question } from "src/Models/MatchModel";
import { useUser } from "src/context/User/hooks/useUser";
import { useMatchmaking } from "src/context/Matchmaking/hooks/useMatchmaking";
import { type SubmissionDTO } from "src/dtos/match/submission.dto";
import { useSocket } from "src/context/Socket/hooks/useSocket";

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
    const { userId } = useUser();
    const { matchMode, matchType } = useMatchmaking();
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
    }

    const submitQuestion = async (data: MathsSubmissionDTO | ProgSubmissionDTO) => {

        const submission: SubmissionDTO = {
            id: match_id,
            player_id: userId,
            question_id: question.id!,
            round_number: round_idx,
            question_number: curr_question,
            match_type: matchType!,
            match_mode: matchMode!,
            submission: data
        }

        const result = await matchSocket?.submitAnswer(submission);

        if (result !== undefined && result.ok) {
            updatePlayerLife(result.data!.player_id, result.data!.life_update);
            submissionResult(result.data!);
            setLastResult({ correct: result.data!.correct, id: Date.now() });
        }
        else {
            submissionError("Marking Error");
        }
    }




    return {
        results,
        lastResult,
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