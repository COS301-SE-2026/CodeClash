import { MatchComponent, PlayersComponent } from "src/entities/components";
import { World } from "src/entities/World";

import { IGameCache } from "src/application/interfaces/cache/IGameCache";

import { LifeSystem } from "src/application/usecases/systems/life.system";
import { SubmissionSystem } from "src/application/usecases/systems/submission.system";
import { NotificationService } from "../notification.service";
import { MarkingStrategy } from "src/application/interfaces/marking/IMarkingStategy";


export class MarkingService {
    private readonly getMatchComponent;
    private readonly marking_strategy;

    constructor(
        private readonly game_cache: IGameCache,
        private readonly submission_system: SubmissionSystem,
        private readonly life_System: LifeSystem,
        private readonly world: ReturnType<typeof World>,
        private readonly notifications: NotificationService,
        private readonly markingStrategy: MarkingStrategy
    ) {

        const { getMatchComponent } = this.world;
        this.getMatchComponent = getMatchComponent
        this.marking_strategy = markingStrategy;
    }

    async execute(match_id: number, player_id: string, question_id: string, answer: string) {
        try {
            // 1. fetch answer from redis 
            const correct_answer = await this.game_cache.getAnswer(question_id);

            if (!correct_answer) throw new Error("Invalid question id");

            // 2. create submission
            const submission = this.submission_system.saveSubmission(match_id, player_id, question_id, null, answer);
            const correct = await this.marking_strategy.mark(submission!, correct_answer);




            // TODO: Move life update into it's own system
            // 4. update player life
            const match = this.getMatchComponent<MatchComponent>(match_id, 'Match');
            const players = this.getMatchComponent<PlayersComponent>(match_id, 'Players');

            const player_entity = players!.players.get(player_id);


            if (player_entity === undefined) throw new Error("Invalid Player");

            let life_update = this.life_System.getCurrentLife(player_entity);

            if (!correct) life_update = this.life_System.decrement(player_entity, match!.question_number);

            // 5. return result
            return { player_id: player_id, result: correct, life_update: life_update };

        }
        catch (error) {
            console.error(`Error Checking answer: ${error}`);
            throw new Error(`${error}`)
        }
    }


}