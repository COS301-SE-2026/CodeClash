import { MathfieldElement } from 'mathlive';
import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "src/context/Socket/hooks/useSocket";
import { robot_map } from 'src/assets/Robots';
import { useLoadRounds, useMatchProgress, useMatchTimer, useOpponentProgress } from 'src/services/match.service';

import { useMatchStore } from 'src/stores/match-store';
import { useMatchmaking } from 'src/context/Matchmaking/hooks/useMatchmaking';
import { useAnswerResponse, useLifeShake, useSubmission } from 'src/services/submission.service';
import type { Player } from 'src/Models/MatchModel';

export const useMatch = () => {
    const nav = useNavigate();
    const { matchSocket } = useSocket();
    const status = useMatchStore(state => state.status);
    const { matchMode } = useMatchmaking();

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [nextRound, setNextRound] = useState(false);
    const [loading, setLoading] = useState(false);
    const [waitingOpponent, setWaitingOpponent] = useState(false);
    const [roundIdx, setRoundIdx] = useState(0);
    const [confirmRound, setConfirmRound] = useState(false);


    const finished_ref = useRef(false);
    const mathfieldRef = useRef<MathfieldElement | null>(null)


    const players = useMatchStore(state => state.players) as Player[];
    const stored_rounds = useMatchStore(state => state.rounds)!;
    const match_id = useMatchStore(state => state.match_id);

    const { rounds, duration } = useLoadRounds(stored_rounds);
    const questions = rounds[roundIdx] ?? [];
    const { playerLife, updatePlayerLife } = useMatchProgress(players);
    const { opponentProgress, handleOpponentDone, opponentCurrent, opponentDone } = useOpponentProgress(questions.length, players, updatePlayerLife);


    const { submissionError, submitQuestion, results, lastResult } = useSubmission({ round_idx: roundIdx, curr_question: currentQuestion, question: questions[currentQuestion], match_id: match_id!, updatePlayerLife })
    const { seconds, minutes } = useMatchTimer(duration, () => {
        setGameOver(true);
        finishGame();
    })

    const last_round = roundIdx === rounds.length - 1;
    const last_q_of_round = questions.length > 0 && currentQuestion === questions.length - 1;
    const complete_round = last_q_of_round && !last_round;
    const final_question = last_q_of_round && last_round;

    const avatars = useMemo(() => players.map(p => robot_map[p.avatar_id]), [players]);
    const usernames = useMemo(() => players.map(p => p.username), [players]);
    const elos = useMemo(() => players.map(p => p.elo), [players]);
    const colourClass = useAnswerResponse(lastResult, currentQuestion);
    const shake = useLifeShake(lastResult);

    const closeLoading = () => setLoading(false);

    const nextQuestion = (curr: number) => {
        if (curr < questions.length - 1) {
            setCurrentQuestion(curr + 1);
        }
    }

    const prevQuestion = (curr: number) => {
        if (curr > 0) {
            setCurrentQuestion(curr - 1)
        }
    }

    const confirmCompleteRound = ()=>{
        if(complete_round) setConfirmRound(true);
    }

    const cancelCompleteRound = ()=>{
        setConfirmRound(false);
    }

    const completeRound = ()=>{
        if(!complete_round) return;
        setConfirmRound(false);
        setRoundIdx(r => r+1);
        setCurrentQuestion(0);
        setNextRound(true);
        setTimeout(()=> setNextRound(false), 500);
    }

    const finishGame = () => {
        console.log("finish game")

        finished_ref.current = true;
        matchSocket?.finishMatch({ match_id: match_id!, match_mode: matchMode! });
    }

    const both_done = () => {
        console.log("Both players done");
        useMatchStore.getState().reset();
        setWaitingOpponent(false);
        nav(`/results/${match_id}`, {
            replace: true,
        });
    }

    useEffect(() => {

        console.log("Match view model mounted")
        if (matchSocket && match_id) {
            setLoading(true);


            const unsub_submission_error = matchSocket.submissionError(submissionError);
            const unsub_done = matchSocket.bothDone(both_done);
            const unsub_opponent_progress = matchSocket.opponentProgress(opponentProgress);
            const unsub_opponent_done = matchSocket.opponentDone(handleOpponentDone);

            setLoading(questions.length === 0);


            return () => {
                unsub_submission_error();
                unsub_done();
                unsub_opponent_progress();
                unsub_opponent_done();
            }
        }

    }, [matchSocket])

    return {
        status,
        players,
        questions,
        playerLife,
        avatars,
        seconds,
        minutes,
        usernames,
        currentQuestion,
        nextQuestion,
        prevQuestion,
        loading,
        closeLoading,
        mathfieldRef,
        results,
        gameOver,
        waitingOpponent,
        finishGame,
        opponentCurrent,
        opponentDone,
        submitQuestion,
        nextRound,
        roundIdx,
        total_rounds: rounds.length,
        rounds,
        elos,
        colourClass,
        shake,
        complete_round,
        final_question,
        confirmRound,
        confirmCompleteRound,
        cancelCompleteRound,
        completeRound
    }
}