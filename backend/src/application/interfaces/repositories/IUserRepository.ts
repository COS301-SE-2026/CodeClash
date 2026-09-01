import { UserDTO } from "src/interface-adapters/dtos/user.dto"

export interface IUserRepository {

    // Create
    createUser(username: string, email: string, cognito_id: string, avatar_id: number, league: string): Promise<UserDTO | null>

    // Read
    getUser(user_id: string): Promise<UserDTO | null>
    getUsers(user_ids: string[]): Promise<UserDTO[] | null>
    getAllUsers(): Promise<UserDTO[] | null>
    getUserId(cognito_id: string): Promise<UserDTO | null>
    getUserData(user_id: string, stat: keyof UserDTO): Promise<UserDTO | null>
}
