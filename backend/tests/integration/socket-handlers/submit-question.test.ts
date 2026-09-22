import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { Server } from 'socket.io'
import { io } from 'socket.io-client';
import { createServer, type Server as HttpServer } from 'http'
import dotenv from 'dotenv'
dotenv.config({ path: '.envv.test' });

import { createTestDataSource } from '../../test-data-source';
import { IQuestionRepository } from '../../../src/application/interfaces/repositories/IQuestionRepository';
import { QuestionRepository } from '../../../src/interface-adapters/repositories/question.repository';
import { IAnswerRepository } from '../../../src/application/interfaces/repositories/IAnswerRepository';
import { AnswerRepository } from '../../../src/interface-adapters/repositories/answer.repository';
import { Questions } from '../../../src/entities/database/questions.entities';
import { Answers } from '../../../src/entities/database/answers.entities';
import { mock_questions } from '../../mocks/mock-questions';
import { mock_answers } from '../../mocks/mock-answers';
import { RoundComponent } from '../../../src/entities/components';
import { AnswerDTO } from '../../../src/entities/dtos/match/answer.dto';
import { PlayerDTO } from '../../../src/entities/dtos/components.dto';
import { MatchCreationSystem, CreateMatchEntity, CreatePlayerEntity, CreateRound } from '../../../src/application/usecases/systems/match-creation.system';
import { MatchCreationService } from '../../../src/application/usecases/services/match/match-creation.service';
import { World } from '../../../src/entities/World';
import { GetQuestions } from '../../../src/application/usecases/services/questions.service';
import { GetAnswers } from '../../../src/application/usecases/services/answers.service';
import { GetTotalTime } from '../../../src/application/usecases/services/questions.service';
import { MatchCache } from '../../../src/interface-adapters/cache/match-cache';
import redis from '../../../src/frameworks-drivers/config/redis-client'
import { IMatchRepository } from '../../../src/application/interfaces/repositories/IMatchRepository';
import { MatchRepository } from '../../../src/interface-adapters/repositories/match.repository';
import { IUserRepository } from '../../../src/application/interfaces/repositories/IUserRepository';
import { UserRepository } from '../../../src/interface-adapters/repositories/user.repository';
import { Users } from '../../../src/entities/database/user.entities';
import { Matches } from '../../../src/entities/database/match.entities';
import { MatchMode, MatchType } from '../../../src/entities/dtos/match/match.dto';
import { registerMatchHandlers } from '../../../src/frameworks-drivers/socket/modules/register-match-handlers'
import { MatchDeps } from '../../../src/frameworks-drivers/socket/dependencies';
import { SubmissionSystem } from '../../../src/application/usecases/systems/submission.system';
import { MatchCompletionService } from '../../../src/application/usecases/services/match/match-completion.service'
import { DeleteGame } from '../../../src/application/usecases/systems/delete-game'
import { MatchStore } from '../../../src/application/usecases/services/match/match-store.service';
import { MarkingResultDTO } from '../../../src/entities/dtos/marking/submission-result.dto'

let http: HttpServer;
let server: Server;

const data_source = await createTestDataSource();
const question_repo: IQuestionRepository = new QuestionRepository(data_source.getRepository(Questions));
const answer_repo: IAnswerRepository = new AnswerRepository(data_source.getRepository(Answers))
const match_repo: IMatchRepository = new MatchRepository(data_source.getRepository(Matches), data_source.getRepository(Users));
const user_repo: IUserRepository = new UserRepository(data_source.getRepository(Users));


let match: {
    match_entity: number,
    match_id: string,
    rounds: RoundComponent[],
    answers: AnswerDTO[]
};

const players: PlayerDTO[] = [
    {
        id: crypto.randomUUID(),
        elo: 600,
        username: 'Player 1',
        life: 100,
        done: false
    },
    {
        id: crypto.randomUUID(),
        elo: 606,
        username: 'Player 2',
        life: 100,
        done: false
    }
];

let marking_service;

const world = World()

const create_player_entity = new CreatePlayerEntity(world);
const create_match_entity = new CreateMatchEntity(world);
const create_rounds = new CreateRound();

const get_questions = new GetQuestions(question_repo);
const get_answers = new GetAnswers(answer_repo);
const get_total_time = new GetTotalTime();

const match_cache = new MatchCache(redis);
const submission_system = new SubmissionSystem(world);
const create_game = new MatchCreationSystem(create_player_entity, create_match_entity, create_rounds);
const match_service = new MatchCreationService(create_game, get_questions, get_total_time, get_answers, match_cache, match_repo, user_repo);

describe("Submit Question socket integration test", () => {

    beforeAll(async () => {
        http = createServer();
        server = new Server(http);

        let user;

        for (const p of players) {
            user = await user_repo.createUser(p.username!, `${p.username}@email.com`, crypto.randomUUID(), 0, 'Mercury')
            p.id = user.user_id;
        }

        server.use((socket, next) => {
            socket.data.user_id = players[0].id;
            socket.data.username = players[0].username;
            next();
        });

        marking_service = {
            execute: vi.fn().mockResolvedValue({
                player_id: players[0].id,
                correct: true,
                speed: 1500,
                attempt_number: 1,
                life_update: 100
            })
        };

        const deps: MatchDeps = {
            marking_service,
            submission_system,
            match_completion_service: {} as MatchCompletionService,
            match_deletion_system: {} as DeleteGame,
            match_store: {} as MatchStore
        }

        server.on("connection", (socket) => {
            registerMatchHandlers(server, socket, deps);
        })

        await data_source.getRepository(Questions).save(mock_questions);
        await data_source.getRepository(Answers).save(mock_answers);


        await new Promise<void>((resolve) => {
            http.listen(0, resolve);
        });

    });

    afterAll(async () => {
        await server.close();

        await new Promise<void>((resolve) => {
            http.close(() => resolve());
        })

    });

    it("Submit Maths Question", async () => {
        match = await match_service.execute(players, MatchMode.Maths, 'Mercury', MatchType.ranked);

        const address = http.address();

        if (!address || typeof address === 'string') throw new Error("Server not running");

        const socket = io(`http://localhost:${address.port}`);

        await new Promise<void>((resolve, reject) => {
            socket.on("connect", () => resolve());
            socket.on("connect_error", reject);
        })

        const round = match.rounds.find(round => round.questions.length > 0);
        const question = round!.questions[0];
        const answer = mock_answers.find(a => a.question!.question_id === question.id);

        const submission = {
            match_id: match.match_entity,
            player_id: players[0].id,
            question_id: question.id,
            question_number: 1,
            submission: { answer: answer!.answer }
        }

        const response = await new Promise<any>((resolve, reject) => {
            socket.emit("submit_question", submission, (response: MarkingResultDTO) => {
                resolve(response);
            });

            socket.on("connect_error", reject);
        });

        expect(response.ok).toBe(true);
        expect(response.data).toEqual({
            player_id: players[0].id,
            correct: true,
            speed: 1500,
            attempt_number: 1,
            life_update: 100
        });
    });


    it("Submits Prog Question", async () => {
        match = await match_service.execute(players, MatchMode.Programming, 'Mercury', MatchType.ranked);

        const address = http.address();

        if (!address || typeof address === 'string') throw new Error("Server not running");

        const socket = io(`http://localhost:${address.port}`);

        await new Promise<void>((resolve, reject) => {
            socket.on("connect", () => resolve());
            socket.on("connect_error", reject);
        })

        const round = match.rounds.find(round => round.questions.length > 0);
        const question = round!.questions[0];
        const answer = mock_answers.find(a => a.question!.question_id === question.id);

        const submission = {
            match_id: match.match_entity,
            player_id: players[0].id,
            question_id: question.id,
            question_number: 1,
            submission: { answer: answer!.answer }
        }

        const response = await new Promise<any>((resolve) => {
            socket.emit("submit_question", submission, (response: MarkingResultDTO) => {
                resolve(response);
            });
        });

        expect(response.ok).toBe(true);
        expect(response.data).toEqual({
            player_id: players[0].id,
            correct: true,
            speed: 1500,
            attempt_number: 1,
            life_update: 100
        });
    })


    it("Uses authenticated player id", async () => {
        const question = match.rounds.find(round => round.questions.length > 0)!.questions[0];

        const address = http.address();
        if (!address || typeof address === 'string') throw new Error("Server not running");
        const socket = io(`http://localhost:${address.port}`);

        await new Promise<void>((resolve, reject) => {
            socket.on("connect", () => resolve());
            socket.on("connect_error", reject);
        })

        const submission = {
            match_id: match.match_entity,
            player_id: players[1].id,   // not the player associated with the socket
            question_id: question.id,
            question_number: 1,
            submission: { answer: "answer" }
        };


        const response = await new Promise<any>((resolve) => {
            socket.emit("submit_question", submission, resolve);
        });

        expect(response.ok).toBe(true);
        expect(marking_service!.execute).toHaveBeenCalledWith(
            expect.objectContaining({
                player_id: players[0].id
            })
        )

    })
})