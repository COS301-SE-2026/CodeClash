import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAllAchievements, getUserAchievements } from '../../../src/interface-adapters/controllers/achievement.controllers';
import { AchievementService } from '../../../src/application/usecases/services/achievement.service';

describe('achievement controllers', () => {
    let mockService: any;
    let req: any;
    let res: any;

    beforeEach(() => {
        mockService = {
            getAllAchievements: vi.fn(),
            getUserAchievements: vi.fn(),
            evaluateAndAward: vi.fn()
        };

        req = { user: { user_id: 'user-1' } };
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        };
    });

    describe('getAllAchievements', () => {
        it('returns 200 with all achievemnts', async () => {
            const mockAchievements = [
                { achievement_id: 'a-1', achievement_name: 'First Blood', description: 'Win your first ranked match' },
                { achievement_id: 'a-2', achievement_name: 'On a Roll', description: 'Win 3 ranked matches in a row' }
            ];
            mockService.getAllAchievements.mockResolvedValueOnce(mockAchievements);

            const handler = getAllAchievements(mockService);
            await handler(req, res);

            expect(mockService.getAllAchievements).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockAchievements);
        });

        it('returns 200 with empty array when no achievements exist', async () => {
            mockService.getAllAchievements.mockResolvedValueOnce([]);

            const handler = getAllAchievements(mockService);
            await handler(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([]);
        });

        it('returns 500 if service throws', async () => {
            
        });


    });

    describe('getUserAchievements', () => {
        it('returns 200 with user achievements', async () => {

        });

        it('returns 200 with empty array when user has no achievemnts', async () => {

        });

        it('returns 401 if user is not authenticate', async ()=> {

        });

        it('returns 500 if service throws', async () => {

        });

        it('scopes query to authenticated user not a URL param', async () => {

        });
    });
});