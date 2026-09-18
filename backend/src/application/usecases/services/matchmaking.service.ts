import { IMatchmakingCache } from "src/application/interfaces/cache/IMatchmakingCache";
import { MatchMode } from "src/entities/database/questions.entities";
import { MatchmakingUserDTO } from "src/entities/dtos/matchmaking/matchmaking.dto";


export class MatchmakingService {
    private readonly elo_difference = 100;

    constructor(
        private readonly cache: IMatchmakingCache
    ) { }


    // adds player to queue
    async enqueue(user: MatchmakingUserDTO, queue: MatchMode): Promise<boolean> {
        await this.cache.enqueue(queue, user);
        return true;
    }


    // remove player from the queue
    async dequeue(user_id: string, queue: MatchMode): Promise<boolean> {
        return await this.cache.dequeue(user_id, queue);
    }

    async matchmaking(user: MatchmakingUserDTO, group_size: number = 2) {
        const player_count = group_size - 1;
        const range = this.elo_difference * user.match_attempt;
        const elo_range = await this.cache.getPlayers(user.match_mode, user.elo, range);

        // get joined_at times for all users in the elo_range
        const result = await Promise.all(
            elo_range.map(async (user_id) => {
                const [join] = await this.cache.getJoinedAt(user_id);
                return { user_id, join };
            })
        );

        const candidates = result
            .filter(p => p.join !== null && p.user_id !== user.id)
            .sort((a, b) => Number(a.join) - Number(b.join));


        if (candidates.length < player_count) {
            const waiting = await this.cache.getUserElo(user.match_mode, user.id);

            if (waiting)   //user is already in the queue
                this.cache.incrementMatchAttempt(user.id);
            else {
                await this.enqueue(user, user.match_mode);
            }

            return null;
        }

        const chosen = candidates.slice(0, player_count);
        const matched_players = await Promise.all(
            chosen.map(async (c) => {
                const elo = Number(await this.cache.getUserElo(user.match_mode, c.user_id));
                await this.cache.deleteUser(user.match_mode, c.user_id);
                return { id: c.user_id, elo };
            })
        )

        const not_chosen = candidates.slice(player_count);
        await Promise.all(
            not_chosen.map(candidate => this.cache.incrementMatchAttempt(candidate.user_id))
        );


        await this.cache.deleteUser(user.match_mode, user.id);

        console.log("Matchmaking Service: ", user.id, "\n", matched_players);

        return [
            { id: user.id, elo: user.elo },
            ...matched_players
        ];
    }

    async math_queue_length(): Promise<number> {
        return this.cache.getQueueLength(MatchMode.Maths)
    }

    async prog_queue_length(): Promise<number> {
        return this.cache.getQueueLength(MatchMode.Programming);
    }
}
