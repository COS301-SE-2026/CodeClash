import { Socket, Server } from "socket.io"
import MatchmakingUserDTO from 'src/entities/dtos/matchmaking.dto';
import { MatchmakingService } from 'src/application/usecases/services/matchmaking.service';
import { GameService } from 'src/application/usecases/services/game.service';
import { GameDataDTO, GameQuestionsDTO } from "src/entities/dtos/game-data.dto";
import { PlayerDTO } from "src/entities/dtos/components.dto";

const PAIRS = new Map<string, Map<string, { accepted: boolean, elo: number, username?: string}>>();
const GAME = new Map<number, { player_ids: string[], questions: GameQuestionsDTO }>();

export const joinMatchQueue = (async (io: Server, socket: Socket, data: any, matchmaking_service: MatchmakingService) => {
    //adds users to a room 
    await socket.join(socket.data.user_id)
    socket.data.game_mode = data.game_mode
    socket.data.elo = data.elo

    const user = new MatchmakingUserDTO(socket.data.user_id, data.elo, data.game_mode);
    let match = null;

    match = await matchmaking_service.matchmaking(user);

    if (!match)
        return;

    const player_1 = match.player_1.id;
    const player_2 = match.player_2.id;

    const pair_id = player_1.concat("-").concat(player_2);

    const pair = {
        player_1: player_1,
        player_2: player_2,
        pair_id: pair_id,
        game_mode: data.game_mode
    }


    PAIRS.set(pair_id, new Map([
        [player_1, { accepted: false, elo: match.player_1.elo }],
        [player_2, { accepted: false, elo: match.player_2.elo }]
    ]));

    io.to(player_1!).emit('users_matched', pair);
    io.to(player_2!).emit('users_matched', pair);
})

export const leaveMatchQueue = (async (io: Server, socket: Socket, matchmaking_service: MatchmakingService) => {
    const remove = await matchmaking_service.dequeue(socket.data.user_id, socket.data.game_mode);

    if (remove) {
        io.to(socket.data.user_id).emit('user_dequeued');
    }
    else
        io.to(socket.data.user_id).emit('dequeue-failed');
})

export const matchAccepted = (async (io: Server, socket: Socket, data: GameDataDTO, game_service: GameService) => {

    PAIRS.get(data.pair_id)?.set(socket.data.user_id, { accepted: true, elo: socket.data.elo, username: data.username });

    const pair = PAIRS.get(data.pair_id);

    if (!pair)
        return;

    const bothAccepted = [...pair.values()].every(val => val.accepted);
    if (bothAccepted) {
        let players: PlayerDTO[] = [];

        pair.forEach((val,key)=>{
            const player: PlayerDTO = {
                id: key,
                username: val.username!,
                elo: val.elo
            }

            players.push(player)
        })
        // TODO data.mode needs to be added as a parameter here
        const setup = await game_service.execute(players, data.game_mode, data.league);

        const keys = [...pair!.keys()];
        GAME.set(setup.id, { player_ids: keys, questions: setup.questions as GameQuestionsDTO })

        for (const key of keys) {
            io.to(key).emit("start_game", { game_id: setup.id });
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

