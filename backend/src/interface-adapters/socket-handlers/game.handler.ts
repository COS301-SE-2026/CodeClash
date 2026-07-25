//These handlers should handle the submission of answers and sending results of the game to both players
import { Socket, Server } from "socket.io";
//In the submission-service branch
import { CheckAnswer } from "src/application/usecases/check-answer";
import { World } from "src/entities/World";
import { PlayersComponent, LifeComponent } from "src/entities/components";

//Handler to return a player's submission results to them
export const submitAnswer = (async (
    io: Server,
    socket: Socket,
    data: { match_id: number; question_id: string; answer: string },
    check_answer: CheckAnswer
) => {
    const player_id = socket.data.user_id;

    try{
        const correct = await check_answer.execute(
            data.match_id,
            player_id,
            data.question_id,
            data.answer
        );
        //send resut only to submitting player
        io.to(player_id).emit('submission_result',{
            question_id: data.question_id,
            correct
        });

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
                    correct,
                    opponent_life: life?.current_life ?? null
                });
            }
        }
    } catch (error) {
        io.to(player_id).emit('submission_error', { message: 'Failed to process submission'});
    }
    
})