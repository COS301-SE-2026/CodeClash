import { IUserRepository } from "src/application/interfaces/repositories/IUserRepository";
import { Users } from "src/entities/database/user.entities";
import { UserDTO } from "src/entities/dtos/users/user.dto";
import { Repository } from "typeorm";
import { EloUpdateResultDTO } from "src/entities/dtos/users/elo.dto";
import { LeaderboardEntryDTO } from "src/entities/dtos/match/leaderboard.dto";
import { RankDTO } from "src/entities/dtos/users/rank.dto";

export class UserRepository implements IUserRepository {
    private readonly K_FACTOR = 32;
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
        } else {
            // streak broken so reset to 1
            current_streak = 1;
        }

        // winning_streak incremented if they won, reset if they lost
        const winning_streak = won ? user.winning_streak + 1 : 0;

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


    async updateEloAfterMatch(
        winner_id: string,
        loser_id: string
    ): Promise<{ winner: EloUpdateResultDTO; loser: EloUpdateResultDTO }> {

        const winnerRating = await this.getUserData(winner_id, 'elo');
        const loserRating = await this.getUserData(loser_id, 'elo');

        if (!winnerRating?.elo || !loserRating?.elo) {
            throw new Error("Players need to have a previous elo to update it");
        }

        const expectedWinner = 1 / (1 + Math.pow(10, (loserRating.elo - winnerRating.elo) / 400));
        const expectedLoser = 1 / (1 + Math.pow(10, (winnerRating.elo - loserRating.elo) / 400));

        const newWinnerRating = Math.round(winnerRating.elo + this.K_FACTOR * (1 - expectedWinner));
        const newLoserRating = Math.round(loserRating.elo + this.K_FACTOR * (0 - expectedLoser));

        const eloGained = newWinnerRating - winnerRating.elo;
        const eloLost = loserRating.elo - newLoserRating;



        return {
            winner: { user_id: winner_id, old_rating: winnerRating.elo, new_rating: newWinnerRating, elo_gained: eloGained },
            loser: { user_id: loser_id, old_rating: loserRating.elo, new_rating: newLoserRating, elo_gained: -eloLost }
        }
    }

    async updateEloAfterTournament(results: { user_id: string, placement: number }[]): Promise<EloUpdateResultDTO[]> {
        const field_size = results.length;
        const players = await Promise.all(
            results.map(r => this.userRepository.findOneBy({ user_id: r.user_id }))
        );

        const field_avg_elo = players.reduce((sum, p) => sum + (p?.elo ?? 0), 0) / field_size;
        const updates: EloUpdateResultDTO[] = [];
        for (let i = 0; i < results.length; i++) {
            const { user_id, placement } = results[i]!;
            const player = players[i];

            if (!player) continue;

            const actual_score = field_size > 1 ? 1 - (placement - 1) / (field_size - 1) : 1;
            const expected_score = 1 / (1 + Math.pow(10, (field_avg_elo - player.elo) / 400));
            const new_rating = Math.round(player.elo + this.K_FACTOR * (actual_score - expected_score));

            await this.userRepository.update({ user_id }, { elo: new_rating });

            updates.push({ user_id, old_rating: player.elo, new_rating, elo_gained: new_rating - player.elo });
        }
        return updates;
    }


    async getLeaderboard(limit: number, offset: number): Promise<{ data: LeaderboardEntryDTO[]; total: number }> {
        const [results, total] = await this.userRepository
            .createQueryBuilder('user')
            .orderBy('user.elo', 'DESC')
            .addOrderBy('user.username', 'ASC')
            .skip(offset)
            .take(limit)
            .getManyAndCount();

        return {
            data: results.map((user, index) => ({
                user_id: user.user_id,
                username: user.username,
                avatar_id: user.avatar_id,
                league: user.league,
                rating: user.elo,
                rank: offset + index + 1
            })),
            total
        };
    }

    async getUserRank(userId: string): Promise<RankDTO | null> {

        const row = await this.userRepository.findOne({
            where: { user_id: userId }
        })

        if (!row) return null;

        const ahead = await this.userRepository
            .createQueryBuilder('user')
            .where('user.elo > :rating', { rating: row.elo})
            .orWhere('user.elo = :rating AND user.username < :username',
                { rating: row.elo, username: row.username })
            .getCount()

        const data: RankDTO = {
            user_id: userId,
            rank: ahead + 1
        };

        return data;
    }


}