import { IUserRepository } from "src/application/interfaces/repositories/IUserRepository";
import { PlayerDTO } from "src/entities/dtos/components.dto";
import { MatchQuestionsDTO } from "src/entities/dtos/match-data.dto";
import { MatchResultDTO } from "src/entities/dtos/match-result.dto";


export class MatchStore {
    private readonly MATCH = new Map<number, {
        database_id: string,
        players: PlayerDTO[],
        questions: MatchQuestionsDTO,
        result: MatchResultDTO | null,
        ack_count: number
    }>();

    constructor(
        private readonly user_repo: IUserRepository
    ) { }


    async create(match_id: number, db_id: string, players: PlayerDTO[], questions: MatchQuestionsDTO) {

        const populatePlayerData = await Promise.all(
            players.map(async (player) => {
                const user_name = await this.user_repo.getUserData(player.id, 'username');
                const user_avatar = await this.user_repo.getUserData(player.id, 'avatar_id');
                return {
                    ...player,
                    username: user_name!.username!,
                    avatar_id: user_avatar!.avatar_id,
                    done: false,
                    life: 100
                }
            })
        )

        this.MATCH.set(match_id, { database_id: db_id, players: populatePlayerData, questions: questions, result: null, ack_count: 0 });
    }

    get(game_id: number) {
        return this.MATCH.get(game_id)
    }

    setDone(player_id: string, game_id: number) {
        const game = this.MATCH.get(game_id);

        if (!game) throw new Error("Invalid game id")

        game.players.forEach((player) => {
            if (player.id === player_id) {
                player.done = true;
            }
        })
    }

    playersDone(game_id: number) {
        const game = this.MATCH.get(game_id);

        if (!game) throw new Error("Invalid game id")

        return game.players.every(player => player.done)
    }

    saveResult(game_id: number, result: MatchResultDTO) {
        const game = this.MATCH.get(game_id);

        if (!game) throw new Error("Invalid game id")

        game.result = result;

    }

    getResult(game_id: number) {
        const game = this.MATCH.get(game_id);

        if (!game) return null;

        return { match_id: game_id, result: game.result }
    }

    deleteMatch(game_id: number) {

        this.MATCH.delete(game_id);

    }
}


