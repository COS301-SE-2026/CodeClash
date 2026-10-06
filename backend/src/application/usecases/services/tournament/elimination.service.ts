import { PlayerStandingDTO } from "src/entities/dtos/tournaments/tournaments.dto";
import { MarkingService } from "../marking/marking.service";
import { PlayerSubmissionDTO } from "src/entities/dtos/submissions/submission.dto";
import { RoundDTO } from "src/entities/dtos/matches/match-component.dto";


const MAX_ATTEMPTS = 3;
interface QuestionProgress {
    attempts: number,
    solved: boolean
}

interface TournamentState {
    players: Map<string, PlayerStandingDTO>,
    rounds: RoundDTO[],
    progress: Map<string, QuestionProgress>,
    finished: boolean,
    start: Date 
}

export class TournamentEliminationService {
    private readonly state = new Map<string, TournamentState>();

    constructor(
        private readonly marking_service: MarkingService,
        // private readonly match_store: MatchStore
    ) { }

    init(tournament_id: string, players: { id: string, username: string }[]) {

        const init_state: TournamentState = {
            players: new Map(
                players.map(p => [
                    p.id, {
                        ...p,
                        correct: 0,
                        total_time: 0,
                        current_round: 0,
                        elimination_round: -1,
                        position: -1,
                        in_danger: false
                    }
                ])),
            rounds:[],
            progress: new Map(),
            finished: false,
            start: new Date()
        }

        this.state.set(tournament_id, init_state);
        console.log("elimination service setting", tournament_id);

        return init_state.players
    }


    async submit(tournament_id: string, submission: PlayerSubmissionDTO) {
        const tournament = this.getTournament(tournament_id);

        const player = tournament.players.get(submission.player_id);

        if (player?.elimination_round !== -1)
            throw new Error("Invalid player");

        const key = `${submission.player_id}:${submission.question_id}`;
        let progress = tournament.progress.get(key);

        if (progress === undefined) {
            progress = { attempts: 0, solved: false };
            tournament.progress.set(key, progress);
        }

        const received_at = new Date();

        if (progress.solved) {
            return {
                player_id: submission.player_id,
                correct: true,
                speed: received_at.getTime() - tournament.start?.getTime(),
                attempt_number: progress.attempts
            }
        }

        if (progress.attempts >= MAX_ATTEMPTS) throw new Error("No attempts left");

        progress.attempts++;
        // const round = tournament.current_round;
        let correct: boolean;
        try {
            correct = await this.marking_service.mark(submission);
        } catch (error) {
            progress.attempts--;
            throw error;
        }

        if (correct && !progress.solved) {
            progress.solved = true;
            ++player.correct;
            player.total_time += received_at.getTime() - tournament.start?.getTime();
        }

        return {
            player_id: submission.player_id,
            correct,
            speed:received_at.getTime() - tournament.start?.getTime(),
            attempt_number: progress.attempts
        };
    }


    // getCurrentRound(tournament_id: string): number {
    //     return this.getTournament(tournament_id).current_round;
    // }

    getTournament(tournament_id: string) {
        const tournament = this.state.get(tournament_id);

        if (!tournament) throw new Error("Tournament not initialised");
        return tournament;
    }

    getStanding(tournament_id: string): PlayerStandingDTO[] {
        const tournament = this.getTournament(tournament_id);

        const alive = this.aliveRanked(tournament);

        const keep = Math.max(1, Math.floor(alive.length / 2));
        const danger = new Set(alive.slice(keep).map(p => p.id));

        const rank = (p: PlayerStandingDTO) => p.elimination_round === -1 ? p.current_round : p.elimination_round;

        console.log("rank ", rank)

        return [...tournament.players.values()]
            .sort((a, b) =>
                rank(b) - rank(a) ||
                b.correct - a.correct ||
                a.total_time - b.total_time
            )
            .map((p, i) => ({ ...p, position: i + 1, in_danger: danger.has(p.id) }));
    }

    private aliveRanked(tournament: TournamentState) {
        return [...tournament.players.values()]
            .filter(p => p.elimination_round === -1)
            .sort((a, b) => b.correct - a.correct || a.total_time - b.total_time);
    }

    clear(tournament_id: string) {
        this.state.delete(tournament_id);
    }
}