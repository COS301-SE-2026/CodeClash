import { IEloRepository } from "src/application/interfaces/IEloRepository";
import { Repository } from "typeorm";
import { Elo_ratings } from "src/entities/db-entities/elo.entities";
import { EloDTO } from "src/entities/dtos/elo.dto";


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
        const elo = await this.eloRepository.findOne({
            where: { user: { user_id: user_id } },

        })


        if (!elo) return null;

        const data: EloDTO = {
            rating: elo.rating
        }
        return data;
    }

    async getUsersElo(user_ids: string[]): Promise<EloDTO[] | null> {

        let elos: EloDTO[] | null = []

        for (const id of user_ids) {
            const elo = await this.eloRepository.findOne({
                where: { user: { cognito_id: id } },
                relations: {
                    user: true
                }
            })

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