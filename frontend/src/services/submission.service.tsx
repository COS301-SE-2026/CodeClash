import { type MarkingResultDTO } from "src/dtos/match/submission.dto";
import { useState} from "react";
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
}

export const useSubmission = ({
    round_idx,
    curr_question,
    question,
    match_id
}: SubmissionProps) => {
    const [results, setResults] = useState<(boolean | null)[][]>([]);
    const { userId } = useUser();
    const { matchMode, matchType } = useMatchmaking();
    const {matchSocket} = useSocket();

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
            match_id: match_id,
            player_id: userId,
            question_id: question.id!,
            round_number: round_idx,    // to be updated
            question_number: curr_question,
            match_type: matchType!,
            match_mode: matchMode!,
            submission: data
        }
        matchSocket?.submitAnswer(submission);
    }

    return{
        results,
        submissionError,
        submissionResult,
        submitQuestion
    }

}