import { LifeComponent, MatchComponent, PlayerInfoComponent, PlayersComponent, RoundComponent, SubmissionRegistryComponent } from "src/entities/components";
import { PlayerDTO, MatchDTO, RoundDTO } from "src/entities/dtos/matches/match-component.dto";
import { MatchQuestionsDTO } from "src/entities/dtos/matches/match.dto";
import { World } from "src/entities/World";

export class MatchCreationSystem {
    constructor(
        private readonly create_players: CreatePlayerEntity,
        private readonly create_match: CreateMatchEntity,
        private readonly create_rounds: CreateRound
    ) { }


    execute(players: PlayerDTO[], match: MatchDTO, questions: MatchQuestionsDTO) {
        // Player entities
        const player_entities = this.create_players.execute(players);

        // Rounds 
        const rounds = this.create_rounds.execute(questions, players.length);

        // Match entity
        const match_entity = this.create_match.execute(match, player_entities, questions, rounds);

        return { match_entity, rounds }
    }

}

export class CreatePlayerEntity {
    private readonly createEntity;
    private readonly addPlayerComponent;

    constructor(
        private readonly world: ReturnType<typeof World>
    ) {
        const { createEntity, addPlayerComponent } = this.world
        this.createEntity = createEntity;
        this.addPlayerComponent = addPlayerComponent
    }


    execute(players: PlayerDTO[]) {
        const entities = new Map<string, number>()
        for (const player of players) {
            const entity = this.createEntity();


            // player info component
            const info: PlayerInfoComponent = {
                id: player.id,
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


export class CreateRound {
    constructor() { }

    execute(question: MatchQuestionsDTO, player_count: number): RoundComponent[] {
        if (player_count === 2) {
            return [
                { round_number: 0, questions: question.easy },
                { round_number: 1, questions: question.medium },
                { round_number: 2, questions: question.hard },
            ];
        }

        const question_pool = [...question.easy, ...question.medium, ...question.hard];
        let round_count = Math.ceil(Math.log2(player_count));
        let q_per_round = Math.floor(question_pool.length / round_count);

        // ensure at least 5 questions per round
        while (q_per_round < 5) {
            --round_count;
            q_per_round = Math.floor(question_pool.length / round_count);
        }

        const rounds: RoundComponent[] = [];
        for (let i = 0; i < round_count; i++) {
            const start = i * q_per_round;
            const end = (i === round_count - 1) ? question_pool.length : start + q_per_round;

            rounds.push({ round_number: i, questions: question_pool.slice(start, end) });
        }
        return rounds;
    }
}

export class CreateMatchEntity {
    private readonly createEntity;
    private readonly addMatchComponent;

    constructor(
        private readonly world: ReturnType<typeof World>
    ) {
        const { createEntity, addMatchComponent } = this.world;
        this.createEntity = createEntity;
        this.addMatchComponent = addMatchComponent
    }

    execute(match: MatchDTO, players: Map<string, number>, questions: MatchQuestionsDTO, rounds: RoundComponent[]) {
        const entity = this.createEntity();

        const players_component: PlayersComponent = {
            players: players
        }

        const question_number = questions.easy.length + questions.medium.length + questions.hard.length;
        const match_component: MatchComponent = {
            title: match.title,
            status: match.status,
            game_mode: match.match_mode,
            match_type: match.match_type,
            difficulty: match.difficulty,
            winner: match.winner,
            rounds: rounds,
            start_time: match.start_time,
            end_time: match.end_time,
            question_number: question_number
        }

        const submission: SubmissionRegistryComponent = {
            submissions: new Map<string, number>()
        }

        this.addMatchComponent(entity, 'Players', players_component);
        this.addMatchComponent(entity, 'Match', match_component);
        this.addMatchComponent(entity, 'Submission', submission);

        return entity;
    }

}

