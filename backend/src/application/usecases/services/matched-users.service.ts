import { MatchedPlayersDTO } from "src/interface-adapters/dtos/match-data.dto";

export class MatchedUsersService {

    private readonly PAIRS = new Map<string, Map<string, { accepted: boolean, elo: number }>>();

    create(match: MatchedPlayersDTO) {
        const player_1 = match.player_1;
        const player_2 = match.player_2;

        const key = `${player_1.id}::${player_2.id}`;

        this.PAIRS.set(key, new Map([
            [player_1.id, { accepted: false, elo: player_1.elo }],
            [player_2.id, { accepted: false, elo: player_2.elo }]
        ]))

        return key;
    }

    accept(pair_id: string, user_id: string) {
        const pair = this.PAIRS.get(pair_id);

        if (!pair) throw new Error("Pair not Found");

        const player = pair.get(user_id);

        if (!player) throw new Error("Player not Found");

        pair.set(user_id, { ...player, accepted: true })
    }

    decline(pair_id: string) {
        this.PAIRS.delete(pair_id);
    }

    get(pair_id: string) {
        return this.PAIRS.get(pair_id)
    }

    bothAccepted(pair_id: string) {

        const pair = this.PAIRS.get(pair_id);

        if (!pair) throw new Error("Pair not Found");
        return [...pair.values()].every(val => val.accepted);
    }

    getPlayers(pair_id: string) {
        const pair = this.PAIRS.get(pair_id);

        if (!pair) throw new Error("Pair not Found");

        const players: { id: string, elo: number, life: number }[] = [];

        pair.forEach((val, key) => {
            const player = {
                id: key,
                elo: val.elo,
                life: 100
            }

            players.push(player)
        })

        return players;
    }

    getKeys(pair_id: string) {
        const pair = this.PAIRS.get(pair_id);

        if (!pair) throw new Error("Pair not Found");

        return [...pair.keys()];
    }

    deletePair(pair_id: string){
        this.PAIRS.delete(pair_id);
    }
}