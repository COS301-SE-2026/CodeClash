import { beforeAll, describe, expect, it } from "vitest";
import { TournamentSocket } from '../../../src/context/Socket/modules/tournament.socket'
import { createSocket } from '../../../src/services/websocket.service'
import { PlayerDTO, MatchMode } from '../../../src/dtos/match/match.dto'
import {TournamentDTO} from '../../../src/dtos/tournaments/tournament.dto'
import dotenv from 'dotenv';
dotenv.config({path: '.env.test'})
const socket = await createSocket();

const players: PlayerDTO[] = [];
const tournament_socket = new TournamentSocket(socket);

const host: PlayerDTO = {
    id: crypto.randomUUID(),
    elo: 1000
};

let tournament: TournamentDTO;

const tournament_size = 7;
describe("Testing tournament socket", () => {
    beforeAll(() => {
        for (let i = 0; i < tournament_size; i++) {
            const player: PlayerDTO = {
                id: crypto.randomUUID(),
                elo: 1000
            };

            players.push(player);
        }

    })


    it("Creates a tournament", async () => {
        const start_date = new Date();
        const match_mode: MatchMode = 'math'

        tournament = await tournament_socket.hostTournament({start_date,match_mode});

        expect(tournament).not.toBeNull();
        expect(tournament.players.length).toBe(1);
    })

    it("Player joins a tournament lobby", async () => {
        const join_handler = (player: PlayerDTO) => { console.log(player) };
        
    })
})