import { Repository } from 'typeorm';
import { Match } from 'src/entities/db-entities/match.entities';
import { IMatchRepository } from 'src/application/interfaces/repositories/IMatchRepository';

export class MatchRepository implements IMatchRepository {
    constructor(private readonly matchRepository: Repository<Match>) { }

    async createMatch(players: string[], mode: 'ranked' | 'casual', match_start: Date): Promise<string> {
        // not using DTOs cause I honestly don't know exactly how they work


        if (players.length < 2) throw new Error("Not Enough Players");

        const match = this.matchRepository.create(
            {
                player1: { user_id: players[0]! },
                player2: { user_id: players[1]! },
                match_type: mode,
                match_start: match_start,
                status: 'starting'
            });

        const saved = await this.matchRepository.save(match);
        return saved.match_id;
    }//end promise
    

    async completeMatch(match_id: string, status: 'completed' | 'abandoned'): Promise<void> {
        await this.matchRepository.update(match_id, { status });
    }
}