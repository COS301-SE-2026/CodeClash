import { IUserRepository } from "src/application/interfaces/repositories/IUserRepository";
import { PlayerDTO } from "src/entities/dtos/components.dto";
import { GameQuestionsDTO } from "src/entities/dtos/match-data.dto";
import { MatchResultDTO } from "src/entities/dtos/match-result.dto";


export class GameStore {
    private GAME = new Map<number, { database_id: string, players: PlayerDTO[], questions: GameQuestionsDTO, result: MatchResultDTO | null }>();

    constructor(
        private readonly user_repo: IUserRepository
    ) { }


    async create(match_id: number, db_id: string, players: PlayerDTO[], questions: GameQuestionsDTO) {

        const populatePlayerData = await Promise.all(
            players.map(async (player) => {
                const user_name = await this.user_repo.getUserData(player.id, 'username');
                const user_avatar = await this.user_repo.getUserData(player.id, 'avatar_id');
                return {
                    ...player,
                    username: user_name!.username!,
                    avatar_id: user_avatar!.avatar_id,
                    done: false
                }
            })
        )

        this.GAME.set(match_id, { database_id: db_id, players: populatePlayerData, questions: questions, result: null });
    }

    get(game_id: number) {
        return this.GAME.get(game_id)
    }

    setDone(player_id: string, game_id: number) {
        const game = this.GAME.get(game_id);

        if (!game) throw new Error("Invalid game id")

        game.players.map((player) => {
            if (player.id === player_id) {
                player.done = true;
                return;
            }
        })
    }

    bothDone(game_id: number) {
        const game = this.GAME.get(game_id);

        if (!game) throw new Error("Invalid game id")

        return game.players.every(player => player.done)
    }

    saveResult(game_id: number, result: MatchResultDTO) {
        const game = this.GAME.get(game_id);

        if (!game) throw new Error("Invalid game id")

        game.result = result;

    }

    geResult(game_id: number) {
        const game = this.GAME.get(game_id);

        if (!game) throw new Error("Invalid game id")

        return game.result
    }
}


