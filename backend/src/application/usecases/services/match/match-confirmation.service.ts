import { PlayerDTO } from "src/entities/dtos/components.dto";
import { createHash } from "crypto";

export class MatchConfirmationService {

    private readonly PLAYERS = new Map<string, { id: string, elo: number, accepted: boolean }[]>();

    create(players: PlayerDTO[]) {
        const sort = players.map(p => p.id).sort().join('::');
        const key = createHash('sha256').update(sort).digest('hex');

        this.PLAYERS.set(key, players.map(p => ({ id: p.id, elo: p.elo, accepted: false })));
        return key;
    }

    accept(id: string, user_id: string) {
        const players = this.PLAYERS.get(id);
        if (!players) throw new Error("Players not Found");

        const player = players.find(p => p.id === user_id);
        if (!player) throw new Error("Player not Found");

        player.accepted = true;
    }


    decline(id: string) {
        this.PLAYERS.delete(id);
    }

    get(pair_id: string) {
        return this.PLAYERS.get(pair_id)
    }

    bothAccepted(pair_id: string) {

        const pair = this.PLAYERS.get(pair_id);

        if (!pair) throw new Error("Pair not Found");
        return [...pair.values()].every(val => val.accepted);
    }

    getPlayers(id: string) {
        const players = this.PLAYERS.get(id);
        if (!players) throw new Error("Pair not Found");

        const arr: { id: string, elo: number, life: number }[] = [];

        players.forEach((key) => {
            const player = {
                id: key.id,
                elo: key.elo,
                life: 100
            }

            arr.push(player)
        })

        return players;
    }

    getKeys(pair_id: string) {
        const pair = this.PLAYERS.get(pair_id);

        if (!pair) throw new Error("Pair not Found");

        return [...pair.keys()];
    }

    deletePair(pair_id: string) {
        this.PLAYERS.delete(pair_id);
    }
}