import { PlayerStandingDTO } from "src/entities/dtos/tournaments/tournaments.dto";
import { MarkingService } from "../marking/marking.service";
import { PlayerSubmissionDTO } from "src/entities/dtos/submissions/submission.dto";


const MAX_ATTEMPTS = 3;
interface QuestionProgress {
    attempts: number,
    solved: boolean
}

interface TournamentState {
    players: Map<string, PlayerStandingDTO>,
    current_round: number,
    round_start: number,
    round_questions: Set<string>,
    progress: Map<string, QuestionProgress>
}

export class TournamentEliminationService {
    private readonly state = new Map<string, TournamentState>();

    constructor(
        private readonly marking_service: MarkingService
    ) { }

    init(tournament_id: string, players: { player_id: string, username: string }[]) {
        this.state.set(tournament_id, {
            players: new Map(
                players.map(p => [
                    p.player_id, {
                        ...p,
                        correct: 0,
                        total_time: 0,
                        elimination_round: -1,
                        position: -1
                    }
                ])),
            current_round: -1,
            round_start: 0,
            round_questions: new Set(),
            progress: new Map()
        });
    }

    startRound(tournament_id: string, round_idx: number, question_ids: string[]) {
        const tournament = this.getTournament(tournament_id);

        tournament.current_round = round_idx;
        tournament.round_start = Date.now();
        tournament.round_questions = new Set(question_ids);
        tournament.progress.clear();

        for (const p of tournament.players.values()) {
            if (p.elimination_round !== -1) continue;

            p.correct = 0;
            p.total_time = 0;
        }
    }

    async submit(tournament_id: string, submission: PlayerSubmissionDTO) {
        const tournament = this.getTournament(tournament_id);
        const player = tournament.players.get(submission.player_id);

        if (!player || player.elimination_round !== -1)
            throw new Error("Invalid player");

        if (!tournament.round_questions.has(submission.question_id))
            throw new Error("Question not in this round");

        const key = `${submission.player_id}:${submission.question_id}`;
        let progress = tournament.progress.get(key);

        if (progress === undefined) {
            progress = { attempts: 0, solved: false };
            tournament.progress.set(key, progress);
        }

        if (progress.solved) return true;
        if (progress.attempts >= MAX_ATTEMPTS) throw new Error("No attempts left");

        progress.attempts++;
        const received_at = Date.now();
        const round = tournament.current_round;

        let correct: boolean;

        try {
            correct = (await this.marking_service.mark(submission)).correct;
        } catch (error) {
            progress.attempts--;
            throw error;
        }

        if (tournament.current_round !== round) return false;

        if (correct && !progress.solved) {
            progress.solved = true;
            ++player.correct;
            player.total_time += received_at - tournament.round_start;
        }

        return correct;
    }


    endRound(tournament_id: string): PlayerStandingDTO[] {
        const tournament = this.getTournament(tournament_id);

        const alive = [...tournament.players.values()]
            .filter(p => p.elimination_round === -1)
            .sort((a, b) => b.correct - a.correct || a.total_time - b.total_time);

        const keep = Math.max(1, Math.floor(alive.length / 2));
        alive.slice(keep).forEach(p => (p.elimination_round = tournament.current_round));

        return alive.slice(0, keep);
    }

    private getTournament(tournament_id: string) {
        const tournament = this.state.get(tournament_id);

        if (!tournament) throw new Error("Tournament not initialised");
        return tournament;
    }

    getStanding(tournament_id: string): PlayerStandingDTO[] {
        const tournament = this.getTournament(tournament_id);

        const rank = (p: PlayerStandingDTO) => p.elimination_round === -1 ? tournament.current_round + 1 : p.elimination_round;

        return [...tournament.players.values()]
            .sort((a, b) =>
                rank(b) - rank(a) ||
                b.correct - a.correct ||
                a.total_time - b.total_time
            )
            .map((p, i) => ({ ...p, position: i + 1 }));
    }
}