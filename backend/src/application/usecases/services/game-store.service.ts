import { IUserRepository } from "src/application/interfaces/repositories/IUserRepository";
import { PlayerDTO } from "src/entities/dtos/components.dto";
import { GameQuestionsDTO } from "src/entities/dtos/match-data.dto";


export class GameStore {
    private GAME = new Map<number, { players: PlayerDTO[], questions: GameQuestionsDTO }>();
    constructor(
        private readonly user_repo: IUserRepository
    ) { }


    async create(match_id: number, players: PlayerDTO[], questions: GameQuestionsDTO) {

        const populatePlayerData = await Promise.all(
            players.map(async (player) => {
                const user_name = await this.user_repo.getUserData(player.id, 'username');
                const user_avatar = await this.user_repo.getUserData(player.id, 'avatar_id');
                return {
                    ...player,
                    username: user_name!.username!,
                    avatar_id: user_avatar!.avatar_id
                }
            })
        )

        this.GAME.set(match_id, { players: populatePlayerData, questions: questions });
    }

    get(game_id: number) {
        return this.GAME.get(game_id)
    }
}


