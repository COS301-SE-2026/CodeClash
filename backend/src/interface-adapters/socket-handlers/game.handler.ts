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
        
    }

    

    //notify opponent of player's progress
})