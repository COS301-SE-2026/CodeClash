import { describe, expect, it, vi } from 'vitest'
import { getUserElo } from '../../../src/interface-adapters/controllers/elo.controllers'


describe("Elo Controller Test", () => {

    it("Returns rating for valid user", async () => {
        const elo_repo = {
            getElo: vi.fn().mockResolvedValue({ rating: 1000 })
        }

        const controller = getUserElo(elo_repo as any)


        const req = {
            user: {
                id: '12345'
            }
        } as any

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        await controller(req, res);

        expect(elo_repo.getElo).toHaveBeenCalledWith('12345');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ rating: 1000 })

    })

    it("Return 404 for invalid user", async () => {
         const elo_repo = {
            getElo: vi.fn().mockResolvedValue(null)
        }

        const controller = getUserElo(elo_repo as any)


        const req = {
            user: {
                id: 'Invalid-user'
            }
        } as any

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        await controller(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({error: 'User not found'})
    })

})