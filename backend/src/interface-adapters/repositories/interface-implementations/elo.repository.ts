import { IEloRepository } from "src/application/interfaces/IEloRepository";
import { Repository } from "typeorm";
import { Elo_ratings } from "../db-entities/elo.entities";
import { EloDTO } from "src/entities/dtos/elo.dto";
import { User } from "../db-entities/user.entities";


export class EloRepository implements IEloRepository {
    constructor(
        private eloRepository: Repository<Elo_ratings>
    ) { }


    async createUserElo(user_id: string): Promise<void> {

       await this.eloRepository.save({
        rating: 600,
        user: {
            user_id: user_id
        }
       })

    }

    async getElo(user_id: string): Promise<EloDTO | null> {
        const elo = await this.eloRepository.findOneBy({ user: { user_id: user_id } })

        if (!elo) return null;

        const data: EloDTO = {
            user_id: elo.user.user_id,
            rating: elo.rating
        }
        return data;
    }

    async getUsersElo(user_ids: string[]): Promise<EloDTO[] | null> {
        let elos: EloDTO[] | null = []

        for (const id of user_ids) {
            const elo = await this.eloRepository.findOneBy({ user: { user_id: id } })

            if (elo) {
                const data: EloDTO = {
                    user_id: elo.user.user_id,
                    rating: elo.rating
                }
                elos.push(data)
            }
        }

        if (elos.length === 0) return null

        return elos;

    }
}