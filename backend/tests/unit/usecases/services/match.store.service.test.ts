import { MatchStore } from "../../../../src/application/usecases/services/match/match-store.service"
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { randomUUID } from 'node:crypto'


let user_repo: any;
let service: MatchStore

describe("Tests Match Store", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        user_repo = {
            getUserData: vi.fn(async (id: string) => {
                user: {
                    username: `user-${id}`
                }
            })
        }

        service = new MatchStore(user_repo);
    })


    it('Creates a match entry', async () => {
        const players = [
            { id: randomUUID(), elo: 600 },
            { id: randomUUID(), elo: 600 },
        ]

        const db_id = randomUUID();
        service.create(1, db_id, players, [], new Date());

        expect(service.get(1)).toContain({
            database_id: db_id,
            players: players.map((p) => ({
                ...p,
                username: `user-${p.id}`,
                done: false,
                life: 100
            })),
        })

    })
})
