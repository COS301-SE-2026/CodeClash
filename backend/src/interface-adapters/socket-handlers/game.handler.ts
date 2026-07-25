//These handlers should handle the submission of answers and sending results of the game to both players
import { Socket, Server } from "socket.io";
import { CheckAnswer } from "src/application/usecases/check-answer";
import { World } from "src/entities/World";
import { PlayersComponent, LifeComponent } from "src/entities/components";

//Handler to return a player's submission results to them
export const submitAnswer = (async () => {

    //send resut only to submitting player


    //notify opponent of player's progress
})