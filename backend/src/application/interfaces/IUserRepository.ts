import { UserDTO } from "src/entities/dtos/user.dto"
import { User } from "src/interface-adapters/repositories/db-entities/user.entities"


export interface IUserRepository {

    // Create
    createUser(username: string, email:string,avatar_id:number, league: string): Promise<UserDTO | null>

    // Read
    getUser(user_id:string): Promise<UserDTO | null>
    getUsers(user_ids: string[]): Promise<UserDTO[] | null>
    getAllUsers(): Promise<UserDTO[]  | null>
}
