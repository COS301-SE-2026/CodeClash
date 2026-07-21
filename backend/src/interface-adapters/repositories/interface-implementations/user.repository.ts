import { IUserRepository } from "src/application/interfaces/IUserRepository";
import { UserDTO } from "src/entities/dtos/user.dto";
import { Repository } from "typeorm";
import { User } from "../db-entities/user.entities";



export class UserRepository implements IUserRepository {
    constructor(
        private userRepository: Repository<User>,
    ) { }

    async createUser(username: string, email: string, avatar_id: number): Promise<void> {
        await this.userRepository.createQueryBuilder()
            .insert()
            .into(User)
            .values({
                username: username,
                email: email,
                avatar_id: avatar_id
            })
            .orIgnore()
            .execute()
    }

    async getUser(user_id: string): Promise<UserDTO | null> {
        const user = await this.userRepository.findOneBy({ user_id: user_id })

        if (user) {
            const data: UserDTO = {
                username: user.username,
                email: user.email,
                avatar_id: user.avatar_id,
                league: user.league
            }
        }
        return user;
    }

    async getUsers(user_ids: string[]): Promise<UserDTO[] | null> {

    }

    async getAllUsers(): Promise<UserDTO[] | null> {

    }
}