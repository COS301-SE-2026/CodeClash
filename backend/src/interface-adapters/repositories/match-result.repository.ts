import { Repository } from "typeorm";
import { MatchLog } from "src/entities/db-entities/match.entities";
import { Users } from "src/entities/db-entities/user.entities";
import { IMatchResultRepository } from "src/application/interfaces/repositories/IMatchResultRepository";
import { MatchResultDTO, PlayerResultDTO } from "src/entities/dtos/match-result.dto";

export class MatchResultRepository implements IMatchResultRepository {
    constructor(
        private readonly matchLogRepo: Repository<MatchLog>,
        private readonly usersRepo: Repository<Users>
    ) { }

    async saveMatchLog(
        match_id: string,
        winner_id: string,
        loser_id: string,
        elo_gained: number,
        elo_lost: number
    ): Promise<void> {
        await this.matchLogRepo.save(this.matchLogRepo.create({
            match: { match_id } as any,
            winner: { user_id: winner_id } as any,
            loser: { user_id: loser_id } as any,
            elo_gained: elo_gained,
            elo_lost: elo_lost
        }));
    }

    async getUserDetails(user_id: string): Promise<{ username: string; avatar: number}> {
        const user = await this.usersRepo.findOne({ where: { user_id } });
        if (!user) throw new Error(`User ${user_id} not found`);
        return { username: user.username, avatar: user.avatar_id };
    }

    async buildMatchResult(match_id: string): Promise<MatchResultDTO> {
        const matchLog = await this.matchLogRepo.findOne({
            where: { match: { match_id } },
            relations: { winner: true, loser: true, match: true }
        });

        if (!matchLog) throw new Error(`Match log for match ${match_id} not found`);

        const winnerDetails = await this.getUserDetails(matchLog.winner.user_id);
        const loserDetails = await this.getUserDetails(matchLog.loser.user_id);

        const players: PlayerResultDTO[] = [{
            user_id: matchLog.winner.user_id,
            username: winnerDetails.username,
            avatar: winnerDetails.avatar,
        },
        {
            user_id: matchLog.loser.user_id,
            username: loserDetails.username,
            avatar: loserDetails.avatar
        }
        ];

        return { match_id, players };
    }
}