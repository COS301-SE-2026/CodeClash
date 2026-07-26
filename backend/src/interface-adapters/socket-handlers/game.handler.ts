import { Server, Socket } from "socket.io";
import { CheckAnswer } from "src/application/usecases/check-answer";
import { SubmissionDTO } from "src/entities/dtos/components.dto";
import { World } from "src/entities/World";
import { PlayersComponent, LifeComponent } from "src/entities/components";

export const submitQuestion = async (io: Server, socket: Socket ,data: SubmissionDTO, check_answer: CheckAnswer) => {
    try {
        const player_id = socket.data.user_id;
        const result = await check_answer.execute(data.match_id, socket.data.user_id, data.question_id, data.answer)

        io.to(socket.data.user_id).emit('submission_result', result);

        const { getMatchComponent, getPlayerComponent } = World();
        const players = getMatchComponent<PlayersComponent>(data.match_id, 'Players');

        if(players){
            for (const [opponent_id, opponent_entity] of players.players){
                //skip self
                if(opponent_id === player_id) continue;

                const life = getPlayerComponent<LifeComponent>(opponent_entity, 'Life');

                //notify the opponent that this player answered
                io.to(opponent_id).emit('opponent_progress', {
                    player_id,
                    correct: result,
                    opponent_life: life?.current_life ?? null
                });
            }
        }
    }
    catch (error:unknown) {
        io.to(socket.data.user_id).emit('submission_error', error);
        return;
    }
}
