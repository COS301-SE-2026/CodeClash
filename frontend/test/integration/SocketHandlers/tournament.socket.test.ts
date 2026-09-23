import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { TournamentSocket } from '../../../src/context/Socket/modules/tournament.socket';
import type { PlayerDTO, MatchMode } from '../../../src/dtos/match/match.dto';
import { type TournamentDTO } from '../../../src/dtos/tournaments/tournament.dto';
import { fetchAuthSession, signIn, signOut } from 'aws-amplify/auth'
import dotenv from 'dotenv';
import { Socket, io } from "socket.io-client";
dotenv.config({ path: '.env.test' })

const env = import.meta.env;

let socket: Socket;
const players: PlayerDTO[] = [];
let tournament_socket: TournamentSocket;

const host: PlayerDTO = {
    id: crypto.randomUUID(),
    elo: 1000
};

let tournament: TournamentDTO;

const tournament_size = 7;
describe("Testing tournament socket", () => {
    beforeAll(async () => {
        await signIn({ username: env.VITE_INTEGRATION_TEST_USER!, password: env.VITE_INTEGRATION_TEST_PASS! });

        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();

        socket = io(env.VITE_WEBSOCKET_URL, {
            auth: { token: token },
            transports: ["websocket"]
        });

        await new Promise<void>((resolve, reject) => {
            socket.on("connect", resolve);
            socket.on("connect_error", reject);
        });

        tournament_socket = new TournamentSocket(socket);
        for (let i = 0; i < tournament_size; i++) {
            const player: PlayerDTO = {
                id: crypto.randomUUID(),
                elo: 1000
            };

            players.push(player);
        }

    })

    afterAll(async () => {
        await signOut();
    })


    it("Creates a tournament", async () => {
        const start_date = new Date();
        const match_mode: MatchMode = 'math'

        const response = await tournament_socket.hostTournament({ start_date, match_mode, host });
        if (!response.ok) throw new Error(response.error);

        tournament = response.data!;

        expect(tournament).not.toBeNull();
        expect(tournament.players.length).toBe(1);
        expect(tournament.players[0].id).toBe(host.id);
    })

    it("Player joins a tournament lobby", async () => {
        const join_handler = (player: PlayerDTO) => { console.log(player) };

    })
})