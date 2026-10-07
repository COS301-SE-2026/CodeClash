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
    round_players: Set<string>[],   // ids of players in each round
    progress: Map<string, QuestionProgress>,
    finished: boolean,
    start: Date,
    left_at: Map<string, number>
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
            rounds: [],
            progress: new Map(),
            finished: false,
            start: new Date(),
            round_players: [new Set(players.map(p => p.id))],
            left_at: new Map(),
        }

        this.state.set(tournament_id, init_state);
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
        let correct: boolean;
        try {
            correct = (await this.marking_service.execute(submission)).correct;
        } catch (error) {
            progress.attempts--;
            throw error;
        }

        player.total_time = received_at.getTime() - tournament.start?.getTime(); // time of latest answer, rather than running summation
        if (correct && !progress.solved) {
            progress.solved = true;
            ++player.correct;
        }

        return {
            player_id: submission.player_id,
            correct,
            speed: received_at.getTime() - tournament.start?.getTime(),
            attempt_number: progress.attempts
        };
    }


    completeRound(tournament_id: string, player_id: string) {

        const tournament = this.getTournament(tournament_id);
        const player = tournament.players.get(player_id);

        if (!player || player.elimination_round !== -1) {
            throw new Error("Invalid player");
        }

        const curr_round = player.current_round;
        const next_round = curr_round + 1;
        const final_round = curr_round === tournament.rounds.length - 1;

        if (final_round) {
          this.leave(tournament, player_id);
            for (const p of tournament.players.values()) {
                if (p.id !== player_id && p.elimination_round === -1) {
                    p.elimination_round = curr_round;
                  p.in_danger = false;
                  this.leave(tournament, p.id)
                }
            }

            return player;
        }

        const curr_size = tournament.round_players[curr_round]!.size;
        const survivor_size = Math.max(1, Math.floor(curr_size / 2));

        tournament.round_players[next_round] ??= new Set();

        player.current_round = next_round;

        tournament.round_players[next_round]!.add(player_id);
        tournament.round_players[curr_round]?.delete(player_id);

        const next = tournament.round_players[next_round]!;

        if (next.size >= survivor_size) {
            for (const p of tournament.players.values()) {
                if (p.current_round === curr_round) {
                    p.elimination_round = curr_round;
                  p.in_danger = false;
                  this.leave(tournament, p.id);
                }
            }
        } else {
            const curr_players = tournament.round_players[curr_round];

            if (curr_players) {
                for (const p of curr_players.values()) {
                    const danger = tournament.players.get(p);
                    danger!.in_danger = true;
                }
            }
        }

        return player;
    }

  private leave(tournament: TournamentState, player_id: string) {
    if (!tournament.left_at.has(player_id)) tournament.left_at.set(player_id, Date.now());
  }

  timeInTournament(tournament_id: string): Map<string, number> {
    const tournament = this.getTournament(tournament_id);
    const now = Date.now();
    return new Map([...tournament.players.keys()].map(id => [id, (tournament.left_at.get(id) ?? now) - tournament.start.getTime()]));
  }

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