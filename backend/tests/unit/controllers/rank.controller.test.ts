import {describe, expect, it, vi} from 'vitest';
import {getUserRank} from "../../../src/interface-adapters/controllers/rank.controllers"

describe("Rank Controller Test", () => {

    it("Returns rank for a valid user", async () => {

        const req ={
            user: {
                id: '56789'
            }
        } as any

        
        const elo_repo = {
            getUserRank
        }

    })




})