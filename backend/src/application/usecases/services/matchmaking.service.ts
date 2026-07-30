import { IMatchmakingCache } from "src/application/interfaces/cache/IMatchmakingCache";
import { GameMode } from "src/entities/db-entities/questions.entities";
import MatchmakingUserDTO from "src/entities/dtos/matchmaking.dto";


export class MatchmakingService {
    private elo_difference = 100;

    constructor(
        private readonly cache: IMatchmakingCache
    ) { }


    // adds player to queue
    async enqueue(user: MatchmakingUserDTO, queue: GameMode): Promise<boolean> {
        await this.cache.enqueue(queue, user);
        return true;
    }


    // remove player from the queue
    async dequeue(user_id: string, queue: GameMode): Promise<boolean> {
        return await this.cache.dequeue(user_id, queue);
    }

    async matchmaking(user: MatchmakingUserDTO) {
        const range = this.elo_difference * user.match_attempt;

        const elo_range = await this.cache.getPlayers(user.game_mode, user.elo, range);

        // get joined_at times for all users in the elo_range
        const result = await Promise.all(
            elo_range.map(async (user_id) => {
                const [join] = await this.cache.getJoinedAt(user_id);
                return { user_id, join };
            })
        );


        // remove null join values
        const players = result.filter(u => u.join !== null);

        // sort by joined times - ascending
        players.sort((a, b) => Number(a.join) - Number(b.join));

        if (players.length == 0) {

            const waiting = await this.cache.getUserElo(user.game_mode, user.id);

            if (waiting)   //user is already in the queue
                ++user.match_attempt;
            else {
                await this.enqueue(user, user.game_mode);
            }

            return null;
        }
        else if (players[0]!.user_id == user.id) {
            return null;
        }
        else {

            const match = players[0];

            if (!match) return null;

            const match_elo = Number(await this.cache.getUserElo(user.game_mode, match.user_id));

            // found a match
            // remove players from queue
            await this.cache.deletUser(user.game_mode, user.id);
            await this.cache.deletUser(user.game_mode, match.user_id)

            return {
                player_2: {
                    id: user.id,
                    elo: user.elo
                },
                player_1: {
                    id: match.user_id,
                    elo: match_elo
                }
            };
        }
    }

    async math_queue_length(): Promise<number> {
        return this.cache.getQueueLength(GameMode.Maths)
    }

    async prog_queue_length(): Promise<number> {
        return this.cache.getQueueLength(GameMode.Programming);
    }
}



