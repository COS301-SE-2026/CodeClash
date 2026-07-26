import { World } from "src/entities/World";
import { IGameCache } from "../interfaces/IGameCache";
import { LifeSystem } from "./systems/life.system";
import { SubmissionSystem } from "./systems/submission.system";
import { MatchComponent, PlayersComponent } from "src/entities/components";


export class CheckAnswer {
    private getMatchComponent;

    constructor(
        private readonly game_cache: IGameCache,
        private readonly submission_system: SubmissionSystem,
        private readonly life_System: LifeSystem,
        private readonly world: ReturnType<typeof World>
    ) {

        const { getMatchComponent } = this.world;
        this.getMatchComponent = getMatchComponent
    }

    async execute(match_id: number, player_id: string, question_id: string, answer: string) {
        try {


            // 1. fetch answer from redis 
            const correct_answer = await this.game_cache.getAnswer(question_id);

            if (!correct_answer) throw new Error("Invalid question id");

            // 2. compare correct vs submitted answer 
            const correct = correct_answer === answer;

            // 3. save answer with submission system
            this.submission_system.saveSubmission(match_id, player_id, question_id, correct, answer);

            // 4. update player life
            const match = this.getMatchComponent<MatchComponent>(match_id, 'Match');
            const players = this.getMatchComponent<PlayersComponent>(match_id, 'Players');

            const player_entity = players!.players.get(player_id);

        
            if (player_entity === undefined) throw new Error("Invalid Player");

            if (!correct) this.life_System.decrement(player_entity, match!.question_number);

            // 5. return result
            return correct;

        }
        catch (error) {
            console.error(`Error Checking answer: ${error}`);
            throw new Error(`${error}`)
        }
    }


}