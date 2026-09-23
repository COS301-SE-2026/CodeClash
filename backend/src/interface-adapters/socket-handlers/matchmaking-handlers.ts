import { Socket, Server } from "socket.io"
import { MatchmakingService } from 'src/application/usecases/services/matchmaking.service';
import { MatchDataDTO, MatchMode } from "src/entities/dtos/match/match.dto";
import { MatchmakingUserDTO } from 'src/entities/dtos/matchmaking/matchmaking.dto';
import { MatchConfirmationService } from "src/application/usecases/services/match/match-confirmation.service";
import { IUserRepository } from "src/application/interfaces/repositories/IUserRepository";
import { MatchStart } from "src/application/usecases/services/match/match-start.service";
import { PlayerDTO } from "src/entities/dtos/components.dto";



export const joinMatchQueue = (async (io: Server, socket: Socket, data: any, matchmaking_service: MatchmakingService, match_confirmation_service: MatchConfirmationService, user_repo: IUserRepository) => {
    socket.join(socket.data.user_id)
    const user: MatchmakingUserDTO = {
        id: socket.data.user_id,
        elo: data.elo,
        match_mode: data.match_mode,
        match_attempt: 1,
        joined_at: new Date()
    };


    const match = await matchmaking_service.matchmaking(user);

    if (!match) return;
    await notifyMatchFound(io, match, data.match_mode, match_confirmation_service, user_repo);

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
        match_confirmation_service: MatchConfirmationService,
        match_start: MatchStart
    ) => {

        match_confirmation_service.accept(data.group_id, socket.data.user_id);

        if (!match_confirmation_service.bothAccepted(data.group_id)) return;


        const players = match_confirmation_service.getPlayers(data.group_id);
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

        // waiting for other player(s) to accept
    })

export const matchDeclined = (async (io: Server, group_id: string, match_mode: MatchMode, match_confirmation_service: MatchConfirmationService, matchmaking_service: MatchmakingService, user_repo: IUserRepository) => {
    const players = match_confirmation_service.getPlayers(group_id);   //get all players

    match_confirmation_service.decline(group_id); //delete player grouping

    // requeue players
    if (players) {
        for (const player of players) {
            io.to(player.id).emit("match_declined");
            const requeue: MatchmakingUserDTO = {
                id: player.id,
                elo: player.elo,
                match_mode: match_mode,
                match_attempt: 1,
                joined_at: new Date()   // this is a bit unfair coz they get requeued at the end of the queue but it's fine for now
            }

            const delay = 6000 + Math.random() * 12000; //NOSONAR

            setTimeout(async () => {
                const match = await matchmaking_service.matchmaking(requeue);

                if (!match) return;
                await notifyMatchFound(io, match, match_mode, match_confirmation_service, user_repo);
            }, delay);
        }

    }
})


export const notifyMatchFound = (async (io: Server, match: PlayerDTO[], match_mode: MatchMode, match_confirmation_service: MatchConfirmationService, user_repo: IUserRepository) => {
    const group_id = match_confirmation_service.create(match);

    const players = await Promise.all(
        match.map(async (p) => {
            const user_data = await user_repo.getUserData(p.id, 'username');
            return {
                ...p,
                username: user_data?.username
            };
        })
    );

    const result = {
        players: players,
        group_id: group_id,
        match_mode: match_mode
    };

    for (const p of match) {
        io.to(p.id).emit('users_matched', result);
    }
})

