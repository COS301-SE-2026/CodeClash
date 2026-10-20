import { PlayerDTO } from "src/entities/dtos/matches/match-component.dto";
import { createHash } from "node:crypto";
import { HttpError } from "src/entities/errors/http-error";
import { MatchType } from "src/entities/dtos/matches/match.dto";

export class MatchConfirmationService {

  private readonly PLAYERS = new Map<string, { id: string, elo: number, accepted: boolean }[]>();
  private readonly MATCH_TYPES = new Map<string, MatchType>();

    create(players: PlayerDTO[], match_type?: MatchType) {
        const sort = players.map(p => p.id).sort((a, b) => a.localeCompare(b)).join('::');
        const key = createHash('sha256').update(sort).digest('hex');

      this.PLAYERS.set(key, players.map(p => ({ id: p.id, elo: p.elo, accepted: false })));
      if (match_type) this.MATCH_TYPES.set(key, match_type);
      else this.MATCH_TYPES.delete(key);
        return key;
    }

  getMatchType(id: string) {
    return this.MATCH_TYPES.get(id);
  }

    accept(id: string, user_id: string) {
        const players = this.PLAYERS.get(id);
        if (!players) throw new HttpError(404, "Match offer no longer available");

        const player = players.find(p => p.id === user_id);
        if (!player) throw new HttpError(404, "Match offer no longer available");

        player.accepted = true;        
    }


    decline(id: string) {
      this.PLAYERS.delete(id);
      this.MATCH_TYPES.delete(id);
    }

    get(pair_id: string) {
        return this.PLAYERS.get(pair_id)
    }

    bothAccepted(group_id: string) {

        const players = this.PLAYERS.get(group_id);

        if (!players) throw new HttpError(404, "Match offer no longer available");
        return [...players.values()].every(val => val.accepted);
    }

    getPlayers(id: string) {
        const players = this.PLAYERS.get(id);
        if (!players) throw new HttpError(404, "Match offer no longer available");

        return players;
    }

    getKeys(pair_id: string) {
        const pair = this.PLAYERS.get(pair_id);

        if (!pair) throw new HttpError(404, "Match offer no longer available");

        return [...pair.keys()];
    }

    deletePair(pair_id: string) {
      this.PLAYERS.delete(pair_id);
      this.MATCH_TYPES.delete(pair_id);
    }
}