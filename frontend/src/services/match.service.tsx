import { useMemo, useRef, useState, useEffect } from "react";
import { useTimer } from "react-timer-hook";
import type { Player } from "src/Models/MatchModel";
import type { MatchMode, QuestionDTO, RoundDTO } from "src/dtos/match/match.dto";
import type { OpponentDTO } from "src/dtos/match/opponent.dto";
import type { MatchSocket } from "src/context/Socket/modules/match.socket";
import { useMatchStore } from "src/stores/match-store";
import { useUser } from "src/context/User/hooks/useUser";
import { seededRandom } from "src/utils/seededRandom";
import { type NavigateFunction } from "react-router-dom";

export function matchStart(match_socket: MatchSocket, path: string, nav: NavigateFunction, match_mode: MatchMode) {
    return match_socket.startMatch((data) => {
        useMatchStore.getState().setMatchData(data, match_mode);
        nav(`${path}/${data.match_id}`);
    })
}

export const useMatchTimer = (duration: number, end_time: number | null, onExpire: () => void) => {
  const expiry_time = useMemo(() => {
      // coutndown to server end time, both players share a clock and reloading shouldnt restart it
      if (end_time) return new Date(end_time);
      const time = new Date();
      time.setSeconds(time.getSeconds() + duration * 60);
        return time;
    }, [duration, end_time]);

    const timer = useTimer({
        expiryTimestamp: expiry_time,
        autoStart: false,
        onExpire
    });

    useEffect(() => {
        if (duration > 0) timer.restart(expiry_time);
    }, [expiry_time]);

    return timer;
}

function shuffle(array: QuestionDTO[], next: () => number = Math.random) {
    let curr = array.length;
    let random;

    while (curr !== 0) {
        random = Math.floor(next() * curr);  // NOSONAR - Math.random() is just to shuffle questions
        curr--;

        [array[curr], array[random]] = [array[random], array[curr]]
    }
    return array;
}


// time_limit is a postgres TIME (HH:MM:SS); returns minutes, possibly fractional
function timeLimitMinutes(time_limit: string): number {
    const [hours = 0, minutes = 0, seconds = 0] = time_limit.split(':').map(Number);
    return hours * 60 + minutes + seconds / 60;
}

export const useLoadRounds = (data: RoundDTO[], match_id?: string | null) => {

  const { userId } = useUser();
  
    return useMemo(() => {
        if (!data || data.length === 0) {
            return {
                rounds: [] as QuestionDTO[][],
                duration: 0
            }
        }
      let sumtime = 0;
      const next = match_id ? seededRandom(`${match_id}:${userId}`) : Math.random;
        const rounds = data.map((round) => {
            const questions: QuestionDTO[] = round.questions.map(q => {
                sumtime += timeLimitMinutes(q.time_limit!);
                return {
                    id: q.id,
                    title: q.title,
                    difficulty: q.difficulty,
                    description: q.description,
                    input_type: q.input_type,
                    templates: q.templates

                };
            });
            return shuffle(questions, next);
        });

        return { rounds, duration: sumtime };

    }, [data, match_id, userId]);
}

export const useMatchProgress = (players: Player[]) => {
    const [playerLife, setPlayerLife] = useState<number[]>(() => players.map(p => p.life));
    const players_ref = useRef(players);

    useEffect(() => {
        players_ref.current = players;
        setPlayerLife(players.map(p => p.life));
    }, [players]);


    const updatePlayerLife = (player_id: string, life: number) => {
        const player_index = players_ref.current.findIndex(p => p.id === player_id);

        if (player_index === -1) return;

        setPlayerLife((prev) => {
            const next = [...prev];
            next[player_index] = life;
            return next
        });

    }

    return {
        playerLife,
        updatePlayerLife
    }
}

export type OpponentPosition = {round: number, question : number};

export const useOpponentProgress = (rounds: QuestionDTO[][], players: Player[], updatePlayerLife: (player_id: string, life: number) => void) => {
    const [opponentCurrent, setOpponentCurrent] = useState<OpponentPosition>({round : 0, question: 0});
    const [opponentDone, setOpponentDone] = useState(false);

    const players_ref = useRef(players);
    const rounds_ref = useRef(rounds);

    useEffect(() => {
        players_ref.current = players;
    }, [players]);

    useEffect(() => {
        rounds_ref.current = rounds;
    }, [rounds]);

    const opponentProgress = (data: OpponentDTO) => {
        const player_index = players_ref.current.findIndex(p => p.id === data.player_id)
        if (player_index === -1) return;

        updatePlayerLife(data.player_id, data.opponent_life);

        const r = rounds_ref.current;
        const round_length = r[data.round]?.length ?? 0;

        const next: OpponentPosition = data.question + 1 < round_length ? {round: data.round, question: data.question + 1} :
        {round: data.round, question: data.question};

        setOpponentCurrent((prev) => {
            //the logic behind the following code is so that you see the last question the opponent answered, not what 
            //happens as they move around the round. Additionally, it also won't show if an opponent resubmits an alrady answered question
            //as the point of this is to show their general progress
            const behind = next.round < prev.round || (next.round === prev.round && next.question <= prev.question);
            return behind ? prev : next
        });
    }

    const handleOpponentDone = () => {
        setOpponentDone(true)
    }

    return {
        opponentCurrent,
        opponentProgress,
        opponentDone,
        handleOpponentDone
    }
}

export const getRoundScore = (results: (boolean | null)[][], rounds: QuestionDTO[][], round_idx: number) => {
    const round_results = results[round_idx] ?? [];
    const correct = round_results.filter(r => r === true).length;
    return {
        correct: correct,
        total: rounds[round_idx]?.length ?? 0
    };
}

//the below code was copied and pasted from another version of this file on another branch, this code was not generated by ai!
export const getCurrentPlayerIndex = (players: Player[], username: string): number => 
    players.findIndex(p => p.username === username)
