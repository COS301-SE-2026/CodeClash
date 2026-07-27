import { World } from "src/entities/World";
import { SubmissionRegistryComponent, SubmissionComponent, MatchComponent, PlayersComponent, LifeComponent } from "src/entities/components";
import { IMatchRepository } from "src/application/interfaces/repositories/IMatchRepository";
import { MatchResultService } from "./match-result.service";

export class MatchCompletionService {
    constructor( 
        private readonly match_repo: IMatchRepository,
        private readonly match_result_service: MatchResultService,
        private readonly world: ReturnType<typeof World>
    ) {}


    async execute(ecs_match_id:number, db_match_id: string, is_ranked: boolean) {
        const { getMatchComponent, getSubmissionComponent, getPlayerComponent } = World();

        const submission_registry = getMatchComponent<SubmissionRegistryComponent>(ecs_match_id, 'Submission');
        const players = getMatchComponent<PlayersComponent>(ecs_match_id, 'Players');
        const match = getMatchComponent<MatchComponent>(ecs_match_id, 'Match');

        if(!submission_registry || !players || !match) throw new Error("Missing match components");

        // reading every submission
        const submissions = new Map<string, SubmissionComponent[]>();
        for (const submission_entity of submission_registry.submissions.values()) {
            const sub = getSubmissionComponent<SubmissionComponent>(submission_entity, 'Submission');
            if(!sub) continue;

            if(!submissions.has(sub.player_id)){
                submissions.set(sub.player_id, []);
            }
            submissions.get(sub.player_id)!.push(sub);
        }

        // check fo rearly elimination via life depletion
        let eliminated_player: string | null = null;
        for(const [player_id, player_entity] of players.players) {
            const life = getPlayerComponent<LifeComponent>(player_entity, 'Life');
            if(life && life.current_life <= 0){
                eliminated_player = player_id;
            }
        }

        let winner_id: string;
        let loser_id: string;
        
        if(eliminated_player){
            const player_ids = [...players.players.keys()];
            loser_id = eliminated_player;
            winner_id = player_ids.find(id => id !== eliminated_player)!;
        }else{
            //compare correctness
            const player_ids = [...players.players.keys()];
            const [player1_id, player2_id] = player_ids;

            if(!player1_id || !player2_id) throw new Error("Match must have exactly 2 players to determine a winner");
            
            const p1_submissions = submissions.get(player1_id) ?? [];
            const p2_submissions = submissions.get(player2_id) ?? [];

            const p1_correct = p1_submissions.filter(s => s.correct).length;
            const p2_correct = p2_submissions.filter(s => s.correct).length;

            if(p1_correct !== p2_correct){
                winner_id = p1_correct > p2_correct ? player1_id : player2_id;
                loser_id = p1_correct > p2_correct ? player2_id : player1_id;
            }else{
                //correctness ties, faster person wins
                const p1_time = this.getLastSubmissionTime(p1_submissions, match.start_time);
                const p2_time = this.getLastSubmissionTime(p2_submissions, match.start_time);

                winner_id = p1_time <= p2_time ? player1_id : player2_id;
                loser_id = p1_time <= p2_time ? player2_id : player1_id;
            }
        }

        await this.match_repo.completeMatch(db_match_id, 'completed');

        return await this.match_result_service.finaliseMatch(
            db_match_id,
            winner_id,
            loser_id,
            is_ranked,
            submissions
        );
    }

    private getLastSubmissionTime(submissions: SubmissionComponent[], match_start: Date): number {
        if (submissions.length === 0) return Infinity;

        const last_submission = submissions.reduce((latest, s) => s.submitted_at > latest.submitted_at ? s : latest);

        return last_submission.submitted_at.getTime() - match_start.getTime();
    }
}