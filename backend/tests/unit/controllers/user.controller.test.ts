import { describe, expect, it, vi } from "vitest";
import { getUserStat } from '../../../src/interface-adapters/controllers/user.controllers';
import { UserDTO } from '../../../src/interface-adapters/dtos/user.dto';

describe("User Controller Test", () => {
    it("Returns value of valid stat req", async () => {
        const user_repo = {
            getUserData: vi.fn().mockResolvedValue({ username: "user123" })
        }

        const controller = getUserStat(user_repo as any);

        const req = {
            params: { stat: 'username' },
            user: {
                id: 'test-user'
            }
        } as any

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        await controller(req, res);

        expect(user_repo.getUserData).toHaveBeenCalledWith('test-user', 'username' as keyof UserDTO);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ username: 'user123' })
    })


    it("Return 400 for invalid stat", async () => {
        const user_repo = {
            getUserData: vi.fn().mockResolvedValue(null)
        }

        const controller = getUserStat(user_repo as any);

        const req = {
            params: { stat: 'invalid-stat' },
            user: {
                id: 'test-user'
            }
        } as any

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        await controller(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid request' })

    })


    it("Return 404 for invalid user", async () => {
        const user_repo = {
            getUserData: vi.fn().mockResolvedValue(null)
        }

        const controller = getUserStat(user_repo as any);

        const req = {
            params: { stat: 'username'},
            user: {
                id: 'invalid-user'
            }
        } as any

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        await controller(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'User not found' })

    })
})