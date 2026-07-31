
import { describe, it, expect, vi } from 'vitest'
import { getMatchResults } from '../../../src/interface-adapters/controllers/match-results.controllers'
import { MatchResultDTO } from '.././../../src/entities/dtos/match-result.dto'

describe("Match Results Controller", () => {

    it("Return results for valid user", async () => {
        const result: MatchResultDTO = {
            match_id: '1',
            players: [
                {
                    user_id: 'user-1',
                    username: 'username',
                    avatar: 2
                }
            ]

        }

        const match_result_service = {
            getMatchResult: vi.fn().mockResolvedValue({ data: result })
        }


        const controller = getMatchResults(match_result_service as any)

        const req = {
            params: {
                match_id: '1'
            }
        } as any

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        await controller(req, res);

        expect(match_result_service.getMatchResult).toHaveBeenCalledWith('1');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ data: result })

    })


    it("Returns 400 for an no match id", async () => {
        const match_result_service = {
            getMatchResult: vi.fn().mockResolvedValue(null)
        }

        const controller = getMatchResults(match_result_service as any)

        const req = {
            params: {
                match_id: null
            }
        } as any

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        await controller(req, res);

        expect(match_result_service.getMatchResult).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: "match ID is required"})

    })


    it("Throws an error for invalid match id", async ()=>{
         const match_result_service = {
            getMatchResult: vi.fn().mockRejectedValue('Mock error throw')
        }

        const controller = getMatchResults(match_result_service as any)

        const req = {
            params: {
                match_id: '1'
            }
        } as any

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        await controller(req, res);

        expect(match_result_service.getMatchResult).toHaveBeenCalledWith('1');
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message: 'Results not ready'})

    })

})