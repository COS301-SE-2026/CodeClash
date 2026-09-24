import { PlayerDTO } from "src/entities/dtos/matches/match-component.dto";
import { MatchStore } from "./match-store.service";
import { MatchCreationService } from "./match-creation.service";
import { MatchMode, MatchType } from "src/entities/dtos/matches/match.dto";

export class MatchStart {
    constructor(
        private readonly match_service: MatchCreationService,
        private readonly match_store: MatchStore
    ) { }

    async execute(players: PlayerDTO[], match_mode: MatchMode, league: string, match_type: MatchType) {
        const setup = await this.match_service.execute(players, match_mode, league, match_type);
        await this.match_store.create(setup.match_entity, setup.match_id, players, setup.rounds);

        const match = this.match_store.get(setup.match_entity);

        if(!match) throw new Error('Match initialisation error');

        return {
            match_id: setup.match_id,
            rounds: match.rounds,
            players: match.players
        }
    }
}