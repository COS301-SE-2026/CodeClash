import {describe, expect, it, vi} from 'vitest';
import {getUserRank} from "../../../src/interface-adapters/controllers/rank.controllers"

describe("Rank Controller Test", () => {

    it("Returns rank for a valid user", async () => {

        const req ={
            user: {
                id: '2000'
            }
        } as any


        const elo_repo = {
            getUserRank: vi.fn().mockResolvedValue({ rank: 7 })
        }

        const controller = getUserRank(elo_repo as any)

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

    })




})