import { IUserRepository } from "src/application/interfaces/repositories/IUserRepository";
import { PlayerDTO, RoundDTO } from "src/entities/dtos/components.dto";
import { MatchResultDTO } from "src/entities/dtos/match/match.dto";


export class MatchStore {
    private readonly MATCH = new Map<number, {
        database_id: string,
        players: PlayerDTO[],
        rounds: RoundDTO[],
        result: MatchResultDTO | null,
        ack_count: number
    }>();

    private readonly DB_ECS = new Map<string, number>();    // maps the matches db id to its ecs id

    constructor(
        private readonly user_repo: IUserRepository
    ) { }


    async create(match_id: number, db_id: string, players: PlayerDTO[], rounds: RoundDTO[]) {

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

        this.MATCH.set(match_id, {
            database_id: db_id,
            players: populatePlayerData,
            rounds: rounds,
            result: null,
            ack_count: 0
        });

        this.DB_ECS.set(db_id, match_id);

    }

    get(match_id: number) {
        return this.MATCH.get(match_id)
    }

    getEcsId(db_id: string) {
        return this.DB_ECS.get(db_id);
    }

    setDone(player_id: string, match_id: number) {
        const match = this.MATCH.get(match_id);

        if (!match) throw new Error("Invalid match id")

        match.players.forEach((player) => {
            if (player.id === player_id) {
                player.done = true;
            }
        })
    }

    playersDone(match_id: number) {
        const match = this.MATCH.get(match_id);

        if (!match) throw new Error("Invalid match id")

        return match.players.every(player => player.done)
    }

    saveResult(match_id: number, result: MatchResultDTO) {
        const match = this.MATCH.get(match_id);

        if (!match) throw new Error("Invalid match id")

        match.result = result;

    }

    getResult(match_id: number) {
        const match = this.MATCH.get(match_id);

        if (!match) return null;

        return { match_id: match_id, result: match.result }
    }

    deleteMatch(match_id: number) {
        const match = this.MATCH.get(match_id);
        if (match) this.DB_ECS.delete(match.database_id);

        this.MATCH.delete(match_id);

    }
}


