import { beforeAll, describe, expect, it, vi } from 'vitest'
import { Server } from 'socket.io'
import { Server as HttpServer } from 'http'
import { PlayerDTO } from '../../../src/entities/dtos/matches/match-component.dto';
import { createTestServer, test_match_creation, socketSetup } from './helper';
import { TournamentService } from '../../../src/application/usecases/services/tournament/tournament.service'
import { TournamentCache } from '../../../src/interface-adapters/cache/tournament-cache'
import { ITournamentCache } from '../../../src/application/interfaces/cache/ITournamentCache'
import { registerTournamentHandlers } from '../../../src/frameworks-drivers/socket/modules/register-tournament-handler'
import { TournamentDeps } from '../../../src/frameworks-drivers/socket/dependencies';
import redis from '../../../src/frameworks-drivers/config/redis-client';
import { TournamentEliminationService } from '../../../src/application/usecases/services/tournament/elimination.service';
import { MarkingService } from '../../../src/application/usecases/services/marking/marking.service';
import { MatchMode } from '../../../src/entities/dtos/matches/match.dto';
import { TournamentDTO } from '../../../src/entities/dtos/tournaments/tournaments.dto'

let http: HttpServer;
let server: Server;

const host: PlayerDTO = {
    id: crypto.randomUUID(),
    elo: 600,
    username: 'host',
    life: 100,
    done: false
}


let players: PlayerDTO[] = [host];

for (let i = 0; i < 10; i++) {
    players.push({
        id: crypto.randomUUID(),
        elo: 600,
        username: `Player ${i + 1}`,
        life: 100,
        done: false
    })
}

const marking_service = {
    execute: vi.fn().mockResolvedValue({
        player_id: players[0].id,
        correct: true,
        speed: 1500,
        attempt_number: 1,
        life_update: 100
    })
};

const tournament_cache: ITournamentCache = new TournamentCache(redis);
const test_create_match = await test_match_creation();
const elimination_service = new TournamentEliminationService(marking_service as unknown as MarkingService);
const tournament_service = new TournamentService(tournament_cache, test_create_match.match_start, elimination_service);
const create_server = await createTestServer(players);

let tournament: TournamentDTO;

describe("Tournament Socket Handelr", () => {
    beforeAll(async () => {
        http = create_server.http;
        server = create_server.server;

        const deps: TournamentDeps = {
            tournament_service: tournament_service
        };

        server.on("connection", (socket) => {
            registerTournamentHandlers(server, socket, deps);
        })
    })


    it("Creates a tournament", async () => {

        const socket = await socketSetup(players[0].id);

        const data = {
            start_date: new Date(),
            match_mode: MatchMode.Maths,
            host: host
        }
        const response = await new Promise<any>((resolve, reject) => {
            socket.emit("host_tournament", data, (response: TournamentDTO) => {
                resolve(response);
            });

            socket.on("connect_error", reject);
        });

        expect(response.ok).toBe(true);
        expect(response.data.host).toEqual(host);
        expect(response.data.players.length).toBe(1);
        tournament = response.data;
    })

    it("Players join tournament", async () => {

        for (const p of players) {
            if (p.id === host.id) continue;

            const socket = await socketSetup(players[0].id);

            const data = {
                tournament_id: tournament.tournament_id,
                player: p
            }

            const response = await new Promise<any>((resolve, reject) => {
                socket.emit("join_tournament", data, (response: TournamentDTO) => {
                    resolve(response);
                });

                socket.on("connect_error", reject);
            })

            expect(response.ok).toBe(true);
            tournament = response.data;
        }

        expect(tournament.players.length).toBe(players.length);
    })


    it("Player leaves tournament", async () => {
        const player = players[4];
        const expected = players.filter(p => p.id !== player.id);

        const socket = await socketSetup(player.id);

        const data = {
            tournament_id: tournament.tournament_id,
            player: player
        }

        const response = await new Promise<any>((resolve, reject) => {
            socket.emit("leave_tournament", data, (response: TournamentDTO) => {
                resolve(response);
            });

            socket.on("connect_error", reject);
        })

        expect(response.ok).toBe(true);
        expect(response.data.players).toEqual(expected);
        tournament = response.data;
    })

    it("Gets a tournament", async () => {
        const socket = await socketSetup(host.id);

        const response = await new Promise<any>((resolve, reject) => {
            socket.emit("get_tournament", tournament.tournament_id, (response: TournamentDTO) => {
                resolve(response);
            });

            socket.on("connect_error", reject);
        })

        expect(response.ok).toBe(true);
        expect(response.data).toEqual(tournament);
    })

    it("Starts a tournament", async () => {
        const socket = await socketSetup(host.id);

        const data = {
            tournament_id: tournament.tournament_id,
            league: "Mercury"
        };

        const response = await new Promise<any>((resolve, reject) => {
            socket.emit("start_tournament", data, (response: TournamentDTO) => {
                resolve(response);
            });

            socket.on("connect_error", reject);
        })

        expect(response.ok).toBe(true);
        expect(response.data).toBeDefined();
    })
})