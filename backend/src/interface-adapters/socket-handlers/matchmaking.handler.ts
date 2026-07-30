import { Socket, Server } from "socket.io"
import MatchmakingUserDTO from 'src/entities/dtos/matchmaking.dto';
import { dequeue, matchmaking } from 'src/application/usecases/services/matchmaking.service';
import { gameService } from 'src/application/usecases/services/game.service';
import { IQuestionRepository } from "src/application/interfaces/IQuestionRepository";
import { GameDataDTO, GameQuestionsDTO } from "src/entities/dtos/game-data.dto";
import { IEloRepository } from "src/application/interfaces/IEloRepository";

const PAIRS = new Map<string, Map<string, boolean>>();
const GAME = new Map<number, { player_ids: string[], questions: GameQuestionsDTO }>();

export const joinMatchQueue = (async (io: Server, socket: Socket, data: any) => {
    //adds users to a room 
    await socket.join(socket.data.user_id)
    socket.data.game_mode = data.game_mode

    const user = new MatchmakingUserDTO(socket.data.user_id, data.elo, data.game_mode);
    let match = null;

    match = await matchmaking(user);

    if (!match)
        return;


    const player_1 = match.player_1_id.toString();
    const player_2 = match.player_2_id.toString();


    const pair_id = player_1.concat("-").concat(player_2);

    const pair = {
        player_1: player_1,
        player_2: player_2,
        pair_id: pair_id,
        game_mode: data.game_mode
    }


    PAIRS.set(pair_id, new Map([[player_1, false], [player_2, false]]));

    io.to(player_1!).emit('users_matched', pair);
    io.to(player_2!).emit('users_matched', pair);
})

export const leaveMatchQueue = (async (io: Server, socket: Socket) => {
    const remove = await dequeue(socket.data.user_id, socket.data.game_mode);

    if (remove) {
        io.to(socket.data.user_id).emit('user_dequeued');
    }
    else
        io.to(socket.data.user_id).emit('dequeue-failed');
})

export const matchAccepted = (async (io: Server, socket: Socket, data: GameDataDTO, question_repo: IQuestionRepository, elo_repo: IEloRepository) => {

    PAIRS.get(data.pair_id)?.set(socket.data.user_id, true);

    const pair = PAIRS.get(data.pair_id);

    const bothAccepted = pair ? [...pair.values()].every(Boolean) : false;

    if (bothAccepted) {
        // call the game service to create the game
        const keys = [...pair!.keys()];
        data.player_ids = keys;
        data.question_number = 5;   //  update this to be dynamic
        const setup = await gameService(question_repo, elo_repo, data);


        if (setup) {
            GAME.set(setup.id, { player_ids: keys, questions: setup.questions as GameQuestionsDTO })
    
            for (const key of keys) {
                io.to(key).emit("start_game", { game_id: setup.id });
            }
        } else {
            console.log("Game service returning false")
        }
    }
    else {
        // waiting for the other player to accept
        // might need to add a timeout 
    }
})

export const matchDeclined = ((io: Server, socket: Socket, pair_id: string) => {
    const pair = PAIRS.get(pair_id);
    const players = pair ? [...pair.keys()] : null; //get ids of paird players 

    PAIRS.delete(pair_id);

    if (players) {
        for (const player of players) {
            if (player === socket.data.user_id) {
                io.to(player).emit("decline_done");
            }
            else {
                io.to(player).emit("game_declined");
            }
        }
    }
})

export const sendGameQuestions = (io: Server, game_id: number) => {
    const data = GAME.get(game_id)

    if (data) {
        for (const id of data!.player_ids!) {
            io.to(id).emit('get_questions', data.questions)
        }
    } else {
        console.log("Game data null")
    }
}

