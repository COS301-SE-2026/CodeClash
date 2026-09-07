import { IUserRepository } from "src/application/interfaces/repositories/IUserRepository";
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

        if (user_ids.length == 0) return null

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

    async searchByUsername(query: string): Promise<UserDTO[]> {
        const users = await this.userRepository
        .createQueryBuilder('u')
        .where('LOWER(u.username) LIKE :query', { query: `%${query.toLowerCase()}%` })
        .limit(20)
        .getMany();

        return users.map(u => ({
            user_id: u.user_id,
            username: u.username,
            avatar_id: u.avatar_id,
            league: u.league
        }));
    }

    async updateStreaks(user_id: string, won: boolean): Promise<void> {
        const user = await this.userRepository.findOneBy({ user_id });
        if (!user) return;

        const today = new Date().toDateString();
        const lastPlayed = (user as any).last_played_at;
        const lastePlayedDate = lastPlayed ? new Date(lastPlayed).toDateString() : null;

        // current streakincremenet if played yesterday or today otherise reset
        let current_streak = user.current_streak;
        if (lastePlayedDate === today) {
            // they already played today
        } else if (lastePlayedDate === new Date(Date.now() - 86400000).toDateString()) {
            current_streak += 1;
        }else {
            // streak broken so reset to 1
            current_streak = 1; 
        }

        // winning_streak incremented if they won, reset if they lost
        const winning_streak = won ? user.winning_streak +1 : 0;

        await this.userRepository.update(user_id, {
            current_streak,
            winning_streak,
            last_played_at: new Date() as any
        });
    }

    async getTotalStats(user_id: string): Promise<{ total_wins: number; total_matches: number; winning_streak: number; league: string; }> {
        const user = await this.userRepository.findOneBy({ user_id });
        if (!user) return { total_wins: 0, total_matches: 0, winning_streak: 0, league: 'Mercury' };
        return {
            total_wins: (user as any).total_wins ?? 0,
            total_matches: (user as any).total_matches ?? 0,
            winning_streak: user?.winning_streak,
            league: user.league
        };
    }
}