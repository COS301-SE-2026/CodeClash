import { UserDTO } from "src/entities/dtos/user.dto"


export interface IUserRepository {

    // Create
    createUser(username: string, email:string,avatar_id:number): Promise<void>

    // Read
    getUser(user_id:string): Promise<UserDTO | null>
    getUsers(user_ids: string[]): Promise<UserDTO[] | null>
    getAllUsers(): Promise<UserDTO[]  | null>
}
