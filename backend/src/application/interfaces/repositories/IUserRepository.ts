import { UserDTO } from "src/entities/dtos/user.dto"

export interface IUserRepository {

    // Create
    createUser(username: string, email: string, cognito_id: string, avatar_id: number, league: string): Promise<UserDTO | null>

    // Read
    getUser(user_id: string): Promise<UserDTO | null>
    getUsers(user_ids: string[]): Promise<UserDTO[] | null>
    getAllUsers(): Promise<UserDTO[] | null>
    getUserId(cognito_id: string): Promise<UserDTO | null>
    getUserData(user_id: string, stat: keyof UserDTO): Promise<UserDTO | null>
    searchByUsername(query: string): Promise<UserDTO[]>
    updateStreaks(user_id: string, won: boolean): Promise<void>
    getTotalStats(user_id: string): Promise<{ total_wins: number; total_matches: number; winning_streak: number; league: string}>
}
