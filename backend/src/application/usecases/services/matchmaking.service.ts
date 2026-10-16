import { IMatchmakingCache } from "src/application/interfaces/cache/IMatchmakingCache";
import { MatchMode, MatchType } from "src/entities/dtos/matches/match.dto";
import { MatchmakingUserDTO } from "src/entities/dtos/matchmaking/matchmaking.dto";


export class MatchmakingService {
    private readonly elo_difference = 100;

    constructor(
        private readonly cache: IMatchmakingCache
    ) { }


    // adds player to queue
    async enqueue(user: MatchmakingUserDTO): Promise<boolean> {
        const queue = user.match_type + "-" + user.match_mode;
        await this.cache.enqueue(queue, user);
        return true;
    }


    // remove player from the queue
    async dequeue(user_id: string, match_mode: MatchMode, match_type: MatchType): Promise<boolean> {
        const queue = match_type + "-" + match_mode;
        return await this.cache.dequeue(user_id, queue);
    }

    async isQueued(user_id: string, match_mode: MatchMode, match_type: MatchType): Promise<boolean> {
        const queue = match_type + "-" + match_mode;
        return (await this.cache.getUserElo(queue, user_id)) !== null;
    }

    async matchmaking(user: MatchmakingUserDTO) {
        const player_count = 2- 1;
        const range = this.elo_difference * user.match_attempt;
        const queue = user.match_type + "-" + user.match_mode;
        const elo_range = await this.cache.getPlayers(queue, user.elo, range);

        // get joined_at times for all users in the elo_range
        const result = await Promise.all(
            elo_range.map(async (user_id) => {
                const join = await this.cache.getJoinedAt(user_id);
                return { user_id, join };
            })
        );

        const candidates = result
            .filter(p => p.join !== null && p.user_id !== user.id)
            .sort((a, b) => Number(a.join) - Number(b.join));

        const matched_players: { id: string, elo: number }[] = [];
        for (const candidate of candidates) {
            if (matched_players.length === player_count) break;
            const elo = Number(await this.cache.getUserElo(queue, candidate.user_id));
            if (await this.cache.deleteUser(queue, candidate.user_id) > 0) matched_players.push({ id: candidate.user_id, elo });
        }


        if (matched_players.length < player_count) {
            await Promise.all(matched_players.map(p => this.enqueue({ id: p.id, elo: p.elo, match_mode: user.match_mode, match_type: user.match_type, match_attempt: 1, joined_at: new Date() })));
            const waiting = await this.cache.getUserElo(queue, user.id);
            const joined = await this.cache.getJoinedAt(user.id);

            if (waiting && joined)   //user is already in the queue
                await this.cache.incrementMatchAttempt(user.id);
            else {
                await this.enqueue(user);
            }

            return null;
        }

        const not_chosen = candidates.slice(player_count);
        await Promise.all(
            not_chosen.map(candidate => this.cache.incrementMatchAttempt(candidate.user_id))
        );


        await this.cache.deleteUser(queue, user.id);

        return [
            { id: user.id, elo: user.elo },
            ...matched_players
        ];
    }
}
