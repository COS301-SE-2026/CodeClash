import { Repository } from 'typeorm';
import { Match } from 'src/entities/db-entities/match.entities';
import { IMatchRepository } from 'src/application/interfaces/repositories/IMatchRepository';

export class MatchRepository implements IMatchRepository {
    constructor(private readonly matchRepository: Repository<Match>) {}

    async createMatch(
        player1_id: string,
        player2_id: string,
        mode: 'ranked' | 'casual',
        match_start: Date
    ): Promise<string> {
        // not using DTOs cause I honestly don't know exactly how they work
        const match =  this.matchRepository.create({player1: { user_id: player1_id } as any, player2: { user_id: player2_id } as any, mode, match_start, status: 'in_progress'});

        const saved = await this.matchRepository.save(match);
        return saved.match_id;
    }//end promise

    async completeMatch(match_id: string, status: 'completed' | 'abandoned'): Promise<string> {
        await this.matchRepository.update(match_id, { status });
    }
}