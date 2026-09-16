import { Socket, Server } from "socket.io"
import { MatchmakingService } from 'src/application/usecases/services/matchmaking.service';
import { MatchDataDTO } from "src/entities/dtos/match-data.dto";
import { MatchmakingUserDTO } from 'src/entities/dtos/matchmaking/matchmaking.dto';
import { MatchConfirmationService } from "src/application/usecases/services/match/match-confirmation.service";
import { MatchStore } from "src/application/usecases/services/match/match-store.service";
import { IUserRepository } from "src/application/interfaces/repositories/IUserRepository";
import { MatchStart } from "src/application/usecases/services/match/match-start.service";



export const joinMatchQueue = (async (io: Server, socket: Socket, data: any, matchmaking_service: MatchmakingService, matched_users_service: MatchConfirmationService, user_repo: IUserRepository) => {

    socket.join(socket.data.user_id)
    const user: MatchmakingUserDTO = {
        id: socket.data.user_id,
        elo: data.elo,
        match_mode: data.match_mode,
        match_attempt: 1,
        joined_at: new Date()
    };

    let match = null;

    match = await matchmaking_service.matchmaking(user);

    if (!match)
        return;

    // const pair_id = matched_users_service.create(match);
    // const player_1_username = await user_repo.getUserData(match.player_1.id, 'username');
    // const Player_2_username = await user_repo.getUserData(match.player_2.id, 'username');

    // const result = {
    //     players: {
    //         player_1: { ...match.player_1, username: player_1_username?.username },
    //         player_2: { ...match.player_2, username: Player_2_username?.username }
    //     },
    //     pair_id: pair_id,
    //     game_mode: data.game_mode
    // }

    // io.to(match.player_1.id).emit('users_matched', result);
    // io.to(match.player_2.id).emit('users_matched', result);
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
        data: MatchDataDTO,
        matched_users_service: MatchConfirmationService,
        match_start: MatchStart
    ) => {
        matched_users_service.accept(data.pair_id, socket.data.user_id);

        if (matched_users_service.bothAccepted(data.pair_id)) { //needs to be updated for tournaments

            const players = matched_users_service.getPlayers(data.pair_id);
            let payload = null;
            try {
                payload = await match_start.execute(players, data.match_mode, data.league, data.match_type);

                for (const player of payload.players) {
                    io.to(player.id).emit('start_match', payload);
                }
            }
            catch (error) {
                console.error('Failed to start match:', error);

                for (const player of players) {
                    io.to(player.id).emit('start_match_failed', { error: 'Failed to start match' });
                }
            }
        }
        // waiting for other player(s) to accept
    })

export const matchDeclined = ((io: Server, socket: Socket, group_id: string, match_confirmation_service: MatchConfirmationService, matchmaking_service: MatchmakingService) => {

    // remove user from players list
    match_confirmation_service.decline(group_id, socket.data.user_id);

    // requeue other player
    const players = match_confirmation_service.getPlayers(group_id);

    if (players) {
        for (const player of players) {
            io.to(player.id).emit("match_declined");
            //requeue users here - matchmaking to be updated
        }
    }

    return;
})

export const sendMatchQuestions = (io: Server, game_id: number, game_store: MatchStore) => {
    const data = game_store.get(game_id)

    if (data) {
        for (const player of data.players) {
            io.to(player.id).emit('get_questions', data.questions)
        }
    } else {
        console.log("Game data null")
    }
}

export const sendGamePlayers = (io: Server, game_id: number, game_store: MatchStore) => {
    const data = game_store.get(game_id)

    if (data) {
        for (const player of data.players) {
            io.to(player.id).emit('get_players', data.players);
        }
    }
}

