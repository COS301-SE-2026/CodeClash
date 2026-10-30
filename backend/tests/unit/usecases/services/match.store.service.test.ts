import { MatchStore } from "../../../../src/application/usecases/services/match/match-store.service"
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { randomUUID } from 'node:crypto'
import { MatchResultDTO } from '../../../../src/entities/dtos/matches/match.dto'


let user_repo: any;
let service: MatchStore

describe("Tests Match Store", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        user_repo = {
            getUserData: vi.fn(async (id: string) => {
                return {
                    username: `user-${id}`
                }
            })
        }

        service = new MatchStore(user_repo);
    })


    const players = [
        { id: randomUUID(), elo: 600 },
        { id: randomUUID(), elo: 600 },
    ]

    it('Creates a match entry', async () => {


        const db_id = randomUUID();
        await service.create(1, db_id, players, [], new Date());

        const match = service.get(1);

        expect(match).toMatchObject({
            database_id: db_id,
            players: players.map((p) => ({
                ...p,
                username: `user-${p.id}`,
                done: false,
                life: 100
            })),
        })
        expect(service.getEcsId(db_id)).toBe(1);
    })

    it("Sets a player's done to true", async () => {
        const db_id = randomUUID();
        await service.create(1, db_id, players, [], new Date());


        service.setDone(players[0].id, 1);

        const match = service.get(1);
        expect(match?.players).toContainEqual({
            id: players[0].id,
            elo: 600,
            username: `user-${players[0].id}`,
            done: true,
            life: 100
        });
    })

    it("Throws an error when updating done for invalid match id ", async () => {
        const db_id = randomUUID();
        await service.create(1, db_id, players, [], new Date());

        expect(() => service.setDone(players[0].id, 2)).toThrow('Invalid match id');
    })

    it("checks if all players are done", async () => {
        const db_id = randomUUID();
        await service.create(1, db_id, players, [], new Date());


        service.setDone(players[0].id, 1);
        expect(service.playersDone(1)).toBe(false);

        service.setDone(players[1].id, 1);
        expect(service.playersDone(1)).toBe(true);
    })

    it("Throws an error when checking done for an invalid match", async () => {
        expect(() => service.playersDone(3)).toThrow('Invalid match id');
    })

    it("Sets eliminated to true", async () => {
        const db_id = randomUUID();
        await service.create(1, db_id, players.map((p) => ({ ...p, eliminated: false })), [], new Date());

        service.eliminate(players[0].id, 1);
        const match = service.get(1);
        expect(match?.players[0]).toMatchObject({
            id: players[0].id,
            eliminated: true
        });
    })

    it("Throws an error when trying to eliminate from an inalid match", () => {
        expect(() => service.eliminate(randomUUID(), 3)).toThrow('Invalid match id');
    })

    it("Saves and retrieves match results", async () => {
        const db_id = randomUUID();
        await service.create(1, db_id, players, [], new Date());

        const player_results = {
            match_id: 1,
            players: [
                {
                    user_id: players[0].id,
                    username: `user-${players[0].id}`,
                    correctness: 50,
                    speed: 8.34,
                    eloEffect: 16,
                    position: 1,
                    rank: 1
                },
                {
                    user_id: players[1].id,
                    username: `user-${players[1].id}`,
                    correctness: 20,
                    speed: 12.34,
                    eloEffect: -16,
                    position: 2,
                    rank: 2
                }
            ]
        }

        service.saveResult(1, player_results);
        expect(service.get(1)?.result).toBe(player_results);
        expect(service.getResult(1)).toBe(player_results);
    })

    it("Throws an error when saving results for na invalid match", () => {
        expect(() => service.saveResult(3, {} as MatchResultDTO)).toThrow('Invalid match id');
    })

    it("Deletes a match", async () => {
        const db_id = randomUUID();
        await service.create(1, db_id, players, [], new Date());

        service.deleteMatch(1);
        expect(service.get(1)).toBeUndefined();
    })
})
