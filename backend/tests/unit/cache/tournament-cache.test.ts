import { beforeAll, describe, expect, it } from 'vitest';
import redis from '../../../src/frameworks-drivers/config/redis-client'
import { TournamentCache } from '../../../src/interface-adapters/cache/tournament-cache'
import { randomUUID } from 'node:crypto';
import { MatchMode, MatchStatus } from '../../../src/entities/dtos/match/match.dto'
import { PlayerDTO } from '../../../src/entities/dtos/components.dto'
import { TournamentDTO } from "../../../src/entities/dtos/tournaments/tournaments.dto";

const tournament_cache = new TournamentCache(redis)
const tournament_id = randomUUID();
const start_date = new Date();
const match_mode = MatchMode.Maths

const player: PlayerDTO = {
    id: randomUUID(),
    elo: 1000,
}

describe("Tournament Cache Test", () => {

    beforeAll(async () => {
        await redis.flushall();
    })

    it("Creates a tournament", async () => {
        await tournament_cache.createTournament(tournament_id, start_date, match_mode);

        const tournament = await redis.get(`tournament:${tournament_id}`)
        expect(tournament).not.toBeNull();
    })

    it("Throws an error when creating a tournament with an existing id", async () => {
        await expect(tournament_cache.createTournament(tournament_id, start_date, match_mode)).rejects.toThrow("Tournament already exists");
    })

    it("Adds a player to a tournament", async () => {
        await tournament_cache.addPlayer(tournament_id, player);

        const tournament = await redis.get(`tournament:${tournament_id}`);
        expect(tournament).not.toBeNull();

        const data: TournamentDTO = JSON.parse(tournament!);
        expect(data.players.length).toBe(1);
        expect(data.players[0].id).toBe(player.id);
    })

    it("Throws an error on adding a player to a non existent tournament", async () => {
        await expect(tournament_cache.addPlayer(randomUUID(), player)).rejects.toThrow('invalid tournament id');
        const tournament = await redis.get(`tournament:${tournament_id}`);

        const data: TournamentDTO = JSON.parse(tournament!);
        expect(data.players.length).toBe(1);
    })

    it("Updates the status of a tournament", async () => {
        await tournament_cache.updateStatus(tournament_id, MatchStatus.Abandoned);

        const tournament = await redis.get(`tournament:${tournament_id}`);
        expect(tournament).not.toBeNull();
        const data: TournamentDTO = JSON.parse(tournament!);

        expect(data.status).toBe(MatchStatus.Abandoned);
    })


    it("Throws an error when trying to add a player to a tournament that's already started", async () => {
        const id = randomUUID();
        const start = new Date(2025, 8, 10, 18, 24);


        await tournament_cache.createTournament(id, start, match_mode)
        await tournament_cache.updateStatus(id, MatchStatus.Abandoned);

        await expect(tournament_cache.addPlayer(id, player.id)).rejects.toThrow("Cannot add player to past or in progress tournaments");

    })

    it("returns a tournament", async () => {
        const expected: TournamentDTO = {
            tournament_id: randomUUID(),
            rounds: [],
            players: [player],
            tournament_mode: match_mode,
            status: MatchStatus.Waiting,
            created_at: new Date(),
            start_date: start_date
        }

        await tournament_cache.createTournament(expected.tournament_id, expected.start_date, match_mode);
        const tournament = await tournament_cache.getTournament(expected.tournament_id);
        const data = await redis.get(`tournament:${expected.tournament_id}`);
        expect(tournament).toEqual(JSON.parse(data!));
    })

    it("Removes a player from a tournament", async () => {
        await tournament_cache.removePlayer(tournament_id, player.id);
        const tournament = await redis.get(`tournament:${tournament_id}`);
        expect(tournament).not.toBeNull();

        const data: TournamentDTO = JSON.parse(tournament!);
        expect(data.players.length).toBe(0);
    })

    it("Throws an error on removing from a non existsent tournament", async () => {
        await expect(tournament_cache.addPlayer(randomUUID(), player)).rejects.toThrow('invalid tournament id');
    })



    it("Deletes a tournament", async () => {
        await tournament_cache.deleteTournament(tournament_id);

        const tournament = await redis.get(`tournament:${tournament_id}`);
        expect(tournament).toBeNull();
    })
})
