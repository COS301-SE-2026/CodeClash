import { type MarkingResultDTO } from "src/dtos/match/submission.dto";
import React, { useState, useRef } from "react";
import { useMatchProgress } from "./match.service";

interface SubmissionProps {
    round_idx: React.RefObject<number>,
    curr_question: number,
}

export const useSubmission = () => {
    const [results, setResults] = useState<(boolean | null)[][]>([]);
    const question_idx = useRef(0);
    const round_idx = useRef(0);
    const {updatePlayerLife} = useMatchProgress()

    const submission_result = (result: MarkingResultDTO) => {
        const index = question_idx.current;

        setResults((prev) => {
            const next = [...prev];
            const round_results = [...(next[round_idx.current] ?? [])];
            round_results[index] = result.correct;
            next[round_idx.current] = round_results;
            return next
        });

        updatePlayerLife(result.player_id, result.life_update);
        if (result.life_update <= 0) {
            finishGame();
            return;
        }

        if (result.correct === true) nextQuestion(index)
    }
}