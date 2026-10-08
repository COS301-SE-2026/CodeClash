import { Socket, Server } from "socket.io"
import { MatchmakingService } from 'src/application/usecases/services/matchmaking.service';
import { MatchDataDTO, MatchMode } from "src/entities/dtos/matches/match.dto";
import { MatchmakingUserDTO } from 'src/entities/dtos/matchmaking/matchmaking.dto';
import { MatchConfirmationService } from "src/application/usecases/services/match/match-confirmation.service";
import { IUserRepository } from "src/application/interfaces/repositories/IUserRepository";
import { MatchStart } from "src/application/usecases/services/match/match-start.service";
import { PlayerDTO } from "src/entities/dtos/matches/match-component.dto";



export const joinMatchQueue = (async (io: Server, socket: Socket, data: any, matchmaking_service: MatchmakingService, match_confirmation_service: MatchConfirmationService, user_repo: IUserRepository) => {
    await socket.join(socket.data.user_id)

    // Use the stored elo rather than trusting the client; a missing elo made the queue range NaN and crashed Redis calls
    const stored = await user_repo.getUserData(socket.data.user_id, 'elo');
    const elo = Number(stored?.elo ?? data?.elo);
    if (!Number.isFinite(elo)) {
        console.warn(`join_match_queue: no valid elo for user ${socket.data.user_id}, ignoring request`);
        return;
    }

    const user: MatchmakingUserDTO = {
        id: socket.data.user_id,
        elo,
        match_mode: data.match_mode,
        match_attempt: 1,
        joined_at: new Date()
    };

    const match = await searchExclusive(() => matchmaking_service.matchmaking(user));
   
        if (!match) {
           retryMatchmaking(io, socket, user, matchmaking_service, match_confirmation_service, user_repo);
            return;
       }
       await notifyMatchFound(io, match, data.match_mode, match_confirmation_service, user_repo);
   
    })
   
    const MATCH_RETRY_MS = 10000;
   
    // one search at a time: two searches running together (e.g. two waiting players retrying at once) could each pick the other and match them twice
    let search_lock: Promise<unknown> = Promise.resolve();
    const searchExclusive = <T>(search: () => Promise<T>): Promise<T> => {
        const run = search_lock.then(search);
        search_lock = run.catch(() => undefined);
       return run;
    }
   
    // matchmaking only runs when someone joins, so a waiting player's elo window (elo_difference * match_attempt) never grew and
    // players further apart than that could never meet; keep searching with a wider window until they're matched or leave the queue
    const retryMatchmaking = (io: Server, socket: Socket, user: MatchmakingUserDTO, matchmaking_service: MatchmakingService, match_confirmation_service: MatchConfirmationService, user_repo: IUserRepository) => {
        setTimeout(async () => {
            try {
               const next = { ...user, match_attempt: user.match_attempt + 1 };
           // stop once they've left the queue: cancelled, disconnected, or matched by someone else's search
           const match = await searchExclusive(async () =>
              socket.connected && await matchmaking_service.isQueued(user.id, user.match_mode) ? matchmaking_service.matchmaking(next) : 'left' as const);

          if (match === 'left') return;
         if (!match) return retryMatchmaking(io, socket, next, matchmaking_service, match_confirmation_service, user_repo);
         await notifyMatchFound(io, match, user.match_mode, match_confirmation_service, user_repo);
     } catch (error) {
        console.error('Failed to retry matchmaking:', error);
    }
}, MATCH_RETRY_MS);
 }

export const leaveMatchQueue = (async (io: Server, socket: Socket, matchmaking_service: MatchmakingService) => {
    const removed = await Promise.all(Object.values(MatchMode).map(mode => matchmaking_service.dequeue(socket.data.user_id, mode)));
    const remove = removed.some(Boolean);

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
        socket.join(data.group_id);
        match_confirmation_service.accept(data.group_id, socket.data.user_id);

        if (!match_confirmation_service.bothAccepted(data.group_id)) {
            return;
        }

        try {
            const players = match_confirmation_service.getPlayers(data.group_id);
            let payload = null;
            payload = await match_start.execute(players, data.match_mode, data.league, data.match_type);
            for (const player of payload.players) {
                io.to(player.id).emit('start_match', payload);
            }
        }
        catch (error) {
            console.error('Failed to start match:', error);
            io.to(data.group_id).emit('start_match_failed', { error: 'Failed to start match' });
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
                try {
                    const match = await matchmaking_service.matchmaking(requeue);

                    if (!match) return;
                    await notifyMatchFound(io, match, match_mode, match_confirmation_service, user_repo);
                } catch (error) {
                    console.error('Failed to requeue player:', error);
                }
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

