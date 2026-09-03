import { World } from "src/entities/World";
import { PlayersComponent } from "src/entities/components";
import { CompleteSubmissionResult, OpponentProgressDTO } from "src/entities/dtos/submission-result.dto";

export class OpponentProgress {

    private readonly getMatchComponent;

    constructor(
        private readonly world: ReturnType<typeof World>
    ) {
        const { getMatchComponent } = this.world
        this.getMatchComponent = getMatchComponent;
    }

    getOpponent(match_id: number, player_id: string) {
        const players = this.getMatchComponent<PlayersComponent>(match_id, 'Players');

        if (!players) throw new Error("Couldn't get player info")


        for (const [opponent_id] of players.players) {
            //skip self
            if (opponent_id === player_id) continue;

            return opponent_id;
        }

    }

    updateOpponent(match_id: number, player_id: string, question_number: number,result: CompleteSubmissionResult,life: number) {
        const opponent = this.getOpponent(match_id, player_id);
        if (!opponent) throw new Error("Error updating opponent");

        const progress: OpponentProgressDTO = {
            player_id: player_id,
            correct: result.correct!,
            opponent_life: life,
            question: question_number
        }

        return progress;
    }
}