import { LifeComponent, MatchComponent, PlayerInfoComponent, PlayersComponent, RoundComponent, SubmissionRegistryComponent } from "src/entities/components";
import { PlayerDTO, MatchDTO, RoundDTO } from "src/entities/dtos/components.dto";
import { World } from "src/entities/World"


export class CreateGame {
    constructor(
        private readonly create_players: CreatePlayerEntity,
        private readonly create_match: CreateMatchEntity,
        private readonly create_round: CreateRoundEntity
    ) { }


    execute(players: PlayerDTO[], match: MatchDTO, rounds: RoundDTO[]) {
        // Player entities
        const player_entities = this.create_players.execute(players);

        // Round entities
        let round_entities: number[] = []
        for (const round of rounds) {
            const round_entity = this.create_round.execute(round);

            round_entities.push(round_entity);
        }

        // Match entity
        const match_entity = this.create_match.execute(match, player_entities, round_entities)

        return match_entity
    }

}

export class CreatePlayerEntity {
    private createEntity;
    private addPlayerComponent;

    constructor() {
        const { createEntity, addPlayerComponent } = World()
        this.createEntity = createEntity;
        this.addPlayerComponent = addPlayerComponent
    }


    execute(players: PlayerDTO[]) {
        let entities = new Map<string, number>()
        for (const player of players) {
            const entity = this.createEntity();


            // player info component
            const info: PlayerInfoComponent = {
                id: player.id,
                username: player.username,
                elo: player.elo
            }

            // initialise player life to full
            const life: LifeComponent = {
                current_life: 100,
                max_life: 100,
            }

            this.addPlayerComponent(entity, 'Info', info)
            this.addPlayerComponent(entity, 'Life', life);

            entities.set(player.id, entity);

        }

        return entities;
    }

}


export class CreateRoundEntity {
    private createEntity;
    private addRoundComponent;

    constructor() {
        const { createEntity, addRoundComponent } = World();

        this.createEntity = createEntity;
        this.addRoundComponent = addRoundComponent
    }


    execute(round: RoundDTO) {
        const entity = this.createEntity();

        const round_component: RoundComponent = {
            question_ids: round.question_ids,
            question_number: round.question_ids.length
        }

        this.addRoundComponent(entity, 'Round', round_component);

        return entity;
    }
}


export class CreateMatchEntity {
    private createEntity;
    private addMatchComponent;

    constructor() {
        const { createEntity, addMatchComponent } = World();
        this.createEntity = createEntity;
        this.addMatchComponent = addMatchComponent
    }

    execute(match: MatchDTO, players: Map<string, number>, rounds: number[]) {
        const entity = this.createEntity();

        const players_component: PlayersComponent = {
            players: players
        }

        const match_component: MatchComponent = {
            title: match.title,
            status: match.status,
            game_mode: match.game_mode,
            difficulty: match.difficulty,
            winner: match.winner,
            rounds: rounds,
            start_time: match.start_time,
            end_time: match.end_time
        }

        const submission: SubmissionRegistryComponent= {
            submissions: new Map<string, number>()
        }


        this.addMatchComponent(entity, 'Players', players_component);
        this.addMatchComponent(entity, 'Match', match_component);
        this.addMatchComponent(entity, 'Submission', submission);

        return entity;
    }

}

