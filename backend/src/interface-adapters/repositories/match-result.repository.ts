import { Repository} from "typeorm";
import { MatchLog } from "src/entities/db-entities/match.entities";
import { Users} from "src/entities/db-entities/user.entities";
import { IMatchResultRepository } from "src/application/interfaces/repositories/IMatchResultRepository";

export class MatchResultRepository implements IMatchResultRepository {
    constructor(
        private readonly matchLogRepo: Repository<MatchLog>,
        private readonly usersRepo: Repository<Users>
    ) {}

    async saveMatchLog(
        match_id: string,
        winner_id: string,
        loser_id: string,
        elo_gained: number | null,
        elo_lost: number | null
    ): Promise<void>{
        await this.matchLogRepo.save(this.matchLogRepo.create({
            match: { match_id } as any,
            winner: { match_id: winner_id } as any,
            loser: { user_id: loser_id } as any,
            elo_gained,
            elo_lost
        }));
    }

    async getUserDetails(user_id: string) : Promise<{ username: string; avatar: string }> {
        const user= await this.usersRepo.findOne({ where: { user_id } });
        if(!user) throw new Error(`User ${user_id} not found`);
        return { username: user.username, avatar: String(user.avatar_id) };
    }
}