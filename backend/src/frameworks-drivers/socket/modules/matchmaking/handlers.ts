import { Socket, Server } from "socket.io"
import { GameService } from 'src/application/usecases/services/game.service';
import { MatchmakingService } from 'src/application/usecases/services/matchmaking.service';
import { GameDataDTO } from "src/entities/dtos/match-data.dto";
import MatchmakingUserDTO from 'src/entities/dtos/matchmaking.dto';
import { MatchedUsersService } from "src/application/usecases/services/matched-users.service";
import { GameStore } from "src/application/usecases/services/game-store.service";
import { IUserRepository } from "src/application/interfaces/repositories/IUserRepository";



export const joinMatchQueue = (
    async (io: Server,
        socket: Socket,
        data: any,
        matchmaking_service: MatchmakingService,
        matched_users_service: MatchedUsersService,
        user_repo: IUserRepository
    ) => {

        socket.join(socket.data.user_id)
        const user = new MatchmakingUserDTO(socket.data.user_id, data.elo, data.game_mode);

        let match = null;

        match = await matchmaking_service.matchmaking(user);

        if (!match)
            return;

        const pair_id = matched_users_service.create(match);
        const player_1_username = await user_repo.getUserData(match.player_1.id, 'username');
        const Player_2_username = await user_repo.getUserData(match.player_2.id, 'username');

        const result = {
            players: {
                player_1: { ...match.player_1, username: player_1_username?.username },
                player_2: { ...match.player_2, username: Player_2_username?.username }
            },
            pair_id: pair_id,
            game_mode: data.game_mode
        }

        io.to(match.player_1.id).emit('users_matched', result);
        io.to(match.player_2.id).emit('users_matched', result);
    })

export const leaveMatchQueue = (async (io: Server, socket: Socket, matchmaking_service: MatchmakingService) => {
    const remove = await matchmaking_service.dequeue(socket.data.user_id, socket.data.game_mode);

    if (remove) {
        io.to(socket.data.user_id).emit('user_dequeued');
    }
    else
        io.to(socket.data.user_id).emit('dequeue-failed');
})

export const matchAccepted = (
    async (
        io: Server,
        socket: Socket,
        data: GameDataDTO,
        game_service: GameService,
        matched_users_service: MatchedUsersService,
        game_store: GameStore
    ) => {
        matched_users_service.accept(data.pair_id, socket.data.user_id);

        if (matched_users_service.bothAccepted(data.pair_id)) {
            const players = matched_users_service.getPlayers(data.pair_id);

            const setup = await game_service.execute(players, data.game_mode, data.league, data.game_type);
            await game_store.create(setup.match_entity, setup.match_id, players, setup.questions);


            const keys = matched_users_service.getKeys(data.pair_id);
            for (const key of keys) {
                io.to(key).emit("start_game", { game_id: setup.match_entity });
            }

        }
        else {
            // waiting for the other player to accept
            // might need to add a timeout 
        }
    })

export const matchDeclined = ((io: Server, socket: Socket, pair_id: string, matched_users_service: MatchedUsersService) => {
    matched_users_service.decline(pair_id);
    const players = matched_users_service.getPlayers(pair_id);

    if (players) {
        for (const player of players) {
            if (player === socket.data.user_id) {
                io.to(player.id).emit("decline_done");
            }
            else {
                io.to(player.id).emit("game_declined");
            }
        }
    }
})

export const sendGameQuestions = (io: Server, game_id: number, game_store: GameStore) => {
    const data = game_store.get(game_id)

    if (data) {
        for (const player of data.players) {
            io.to(player.id).emit('get_questions', data.questions)
        }
    } else {
        console.log("Game data null")
    }
}

export const sendGamePlayers = (io: Server, game_id: number, game_store: GameStore) => {
    const data = game_store.get(game_id)

    if (data) {
        for (const player of data.players) {
            io.to(player.id).emit('get_players', data.players);
        }
    }
}

