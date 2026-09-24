import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { Server } from 'socket.io'
import { type Server as HttpServer } from 'http'
import dotenv from 'dotenv'
dotenv.config({ path: '.envv.test' });

import { mock_answers } from '../../mocks/mock-answers';
import { RoundComponent } from '../../../src/entities/components';
import { AnswerDTO } from '../../../src/entities/dtos/questions/answer.dto';
import { PlayerDTO } from '../../../src/entities/dtos/matches/match-component.dto';
import { World } from '../../../src/entities/World';
import { MatchMode, MatchType } from '../../../src/entities/dtos/matches/match.dto';
import { registerMatchHandlers } from '../../../src/frameworks-drivers/socket/modules/register-match-handlers'
import { MatchDeps } from '../../../src/frameworks-drivers/socket/dependencies';
import { SubmissionSystem } from '../../../src/application/usecases/systems/submission.system';
import { MatchCompletionService } from '../../../src/application/usecases/services/match/match-completion.service'
import { DeleteGame } from '../../../src/application/usecases/systems/delete-game'
import { MatchStore } from '../../../src/application/usecases/services/match/match-store.service';
import { MarkingResultDTO } from '../../../src/entities/dtos/submissions/submission-result.dto'
import { createTestMatch, createTestServer, deleteTestMatch, socketSetup } from './helper';

let server: Server;
let http: HttpServer;


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
const submission_system = new SubmissionSystem(world);
const create_server = await createTestServer(players);


describe("Submit Question socket integration test", () => {

    beforeAll(async () => {
        server = create_server.server;
        http = create_server.http;

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

    });

    afterAll(async () => {
        await server.close();
        await new Promise<void>((resolve) => {
            http.close(() => resolve());
        })
    });



    it("Submit Maths Question", async () => {

        match = await createTestMatch(players, MatchMode.Maths, MatchType.ranked);

        const socket = await socketSetup(players[0].id);

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

        deleteTestMatch(players.map(p => p.id), MatchType.ranked, match);
    });


    it("Submits Prog Question", async () => {
        match = await createTestMatch(players, MatchMode.Maths, MatchType.ranked);
        // console.log(match);

        const address = http.address();

        if (!address || typeof address === 'string') throw new Error("Server not running");

        const socket = await socketSetup(players[0].id);

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

        // deleteTestMatch(players.map(p => p.id), MatchType.ranked, match);
    })


    it("Uses authenticated player id", async () => {
        const question = match.rounds.find(round => round.questions.length > 0)!.questions[0];

        const socket = await socketSetup(players[0].id);

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