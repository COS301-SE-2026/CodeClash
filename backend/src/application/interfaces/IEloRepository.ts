import { EloDTO } from "src/entities/dtos/elo.dto"


export interface IEloRepository {
    // Creat
    createUserElo(user_id: string): Promise<void>

    // Read
    getElo(user_id: string): Promise<EloDTO | null>
    getUsersElo(user_ids: string[]): Promise<EloDTO[] | null>
}
