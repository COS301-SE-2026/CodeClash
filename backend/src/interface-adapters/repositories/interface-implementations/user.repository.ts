import { IUserRepository } from "src/application/interfaces/IUserRepository";
import { UserDTO } from "src/entities/dtos/user.dto";
import { Repository } from "typeorm";
import { User } from "../db-entities/user.entities";



export class UserRepository implements IUserRepository {
    constructor(
        private userRepository: Repository<User>,
    ) { }

    async createUser(username: string, email: string, avatar_id: number, league: string): Promise<UserDTO | null> {
        const insert = await this.userRepository.createQueryBuilder()
            .insert()
            .into(User)
            .values({
                username: username,
                email: email,
                avatar_id: avatar_id,
                league: league
            })
            .orIgnore()
            .execute()

        const id = insert.identifiers[0];

        if(id === undefined) return null

        const data: UserDTO = {
            user_id: id.user_id
        }

        return data
    }

    async getUser(user_id: string): Promise<UserDTO | null> {
        const user = await this.userRepository.findOneBy({ user_id: user_id })

        return user;
    }

    async getUsers(user_ids: string[]): Promise<UserDTO[] | null> {
        let users: UserDTO[] | null = [];

        for (const id of user_ids) {
            const user = await this.userRepository.findOneBy({ user_id: id })

            if (user) {
                users.push(user)
            }
        }

        if (user_ids.length == 0) return null

        return users;
    }

    async getAllUsers(): Promise<UserDTO[] | null> {
        const users = await this.userRepository.find();

        return users
    }


}