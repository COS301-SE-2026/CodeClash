import { useMemo, useRef, useState, useEffect } from "react";
import { useTimer } from "react-timer-hook";
import type { Player } from "src/Models/MatchModel";
import type { QuestionDTO } from "src/dtos/match/match.dto";
import type { RoundDTO } from "src/dtos/match/match.dto";
import type { OpponentDTO } from "src/dtos/match/opponent.dto";
import type { MathsSubmissionDTO, ProgSubmissionDTO } from "src/dtos/match/submission.dto";
import type { MatchSocket } from "src/context/Socket/modules/match.socket";
import { useMatchStore } from "src/stores/match-store";

export function matchStart(match_socket: MatchSocket) {

    return match_socket.startMatch((data) => {
        useMatchStore.getState().setMatchData(data);
    })
}

export const useMatchTimer = (duration: number, onExpire: () => void) => {
    const expiry_time = useMemo(() => {
        const time = new Date();
        time.setSeconds(time.getSeconds() + duration * 60);
        return time;
    }, [duration]);


    const timer = useTimer({
        expiryTimestamp: expiry_time,
        autoStart: false,
        onExpire
    });

    useEffect(() => {
        if (duration > 0) timer.restart(expiry_time);
    }, [duration]);

    return timer;
}

function shuffle(array: QuestionDTO[]) {
    let curr = array.length;
    let random;

    while (curr !== 0) {
        random = Math.floor(Math.random() * curr);  // NOSONAR - Math.random() is just to shuffle questions
        curr--;

        [array[curr], array[random]] = [array[random], array[curr]]
    }
    return array;
}


export const loadRounds = (data: RoundDTO[]) => {
    const { rounds, duration } = useMemo(() => {
        if (!data || data.length === 0) {
            return {
                rounds: [] as QuestionDTO[][],
                duration: 0
            }
        }

        let sumtime = 0;
        const rounds: QuestionDTO[][] = data.map((round) => {
            const temp_arr: QuestionDTO[] = round.questions.map(q => {
                sumtime += Number(q.time_limit!.split(":")[1]);
                return {
                    id: q.id,
                    title: q.title,
                    difficulty: q.difficulty,
                    description: q.description,
                    input_type: q.input_type
                };
            });
            return shuffle(temp_arr);
        });

        return { rounds, duration: sumtime };

    }, [data]);

    return { rounds, duration }

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

export const useOpponentProgress = (num_questions: number, players: Player[]) => {
    const [opponentCurrent, setOpponentCurrent] = useState(0);
    const [opponentDone, setOpponentDone] = useState(false);

    const players_ref = useRef(players);

    useEffect(() => {
        players_ref.current = players;
    }, [players]);

    const opponentProgress = (data: OpponentDTO) => {
        const player_index = players_ref.current.findIndex(p => p.id === data.player_id)
        if (player_index === -1) return;

        setOpponentCurrent((prev) => {
            const next = data.question + 1;
            return (next < num_questions) ? next : prev;
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

export const useMathSubmission = (answer: string): MathsSubmissionDTO => {
    return { answer: answer };
}

export const useProgSubmission = (source_code: string, language_id: number, stdin: string | null): ProgSubmissionDTO => {
    return {
        source_code: source_code,
        language_id: language_id,
        stdin: stdin
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
