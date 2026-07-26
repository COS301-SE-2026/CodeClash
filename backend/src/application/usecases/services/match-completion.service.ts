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

        if(!submission_registry || !players) throw new Error("Missing match components");

        // reading every submission
        const submissions: SubmissionComponent[] = [];
        for (const submission_entity of submission_registry.submissions.values()) {
            const sub = getSubmissionComponent<SubmissionComponent>(submission_entity, 'Submission');
            if(sub) submissions.push(sub);
        }

        // determining the winner
        let winner_id: string | null = null;
        let loser_id: string | null = null;
        if(!winner_id ||!loser_id) throw new Error("Could not determine match winner/loser");
    }
}