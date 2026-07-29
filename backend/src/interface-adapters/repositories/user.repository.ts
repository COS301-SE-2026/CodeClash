import { IUserRepository } from "src/application/interfaces/IUserRepository";
import { Users } from "src/entities/db-entities/user.entities";
import { UserDTO } from "src/entities/dtos/user.dto";
import { Repository } from "typeorm";



export class UserRepository implements IUserRepository {
    constructor(
        private readonly userRepository: Repository<Users>,
    ) { }

    async createUser(username: string, email: string, cognito_id: string, avatar_id: number, league: string): Promise<UserDTO | null> {
        const insert = await this.userRepository.createQueryBuilder()
            .insert()
            .into(Users)
            .values({
                username: username,
                email: email,
                cognito_id: cognito_id,
                avatar_id: avatar_id,
                league: league
            })
            .orIgnore()
            .execute()

        const id = insert.identifiers[0];

        if (id === undefined) return null

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
        const users: UserDTO[] | null = [];

        for (const id of user_ids) {
            const user = await this.userRepository.findOneBy({ user_id: id })

            if (user) {
                users.push(user)
            }
        }

        if (user_ids.length === 0) return null

        return users;
    }

    async getAllUsers(): Promise<UserDTO[] | null> {
        const users = await this.userRepository.find();

        return users
    }

    async getUserId(cognito_id: string): Promise<UserDTO | null> {
        const user = await this.userRepository.findOneBy({ cognito_id: cognito_id })

        if (!user) return null;

        const data: UserDTO = {
            user_id: user.user_id
        }

        return data;
    }

    async getUserData(user_id: string, stat: keyof UserDTO): Promise<UserDTO | null> {
        const user = await this.userRepository.findOneBy({ user_id: user_id })

        if (!user) return null;

        const data: UserDTO = {
            [stat]: user[stat]
        }
        
        return data
    }

}