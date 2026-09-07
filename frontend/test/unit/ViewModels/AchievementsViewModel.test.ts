import {renderHook, waitFor} from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {AchievementsViewModelFunc} from '../../../src/ViewModels/AchievementsViewModel';

{/*Copying mocks from FriendsContext.test.tsx */}

const {mockUseAuth, mockShowAchievement, mockGetIcon} = vi.hoisted(() => ({
    mockUseAuth: vi.fn(),
    mockShowAchievement: vi.fn(),
    mockGetIcon:vi.fn((name:string) => `icon:${name}`)
}))

vi.mock("src/context/Auth/hooks/useAuth", () => ({
    useAuth: mockUseAuth
}))

vi.mock("src/context/Achievement/AchievementToastContext", () => ({
    useAchievementToast: () => ({
        showAchievement: mockShowAchievement
    })
}))

vi.mock("src/Models/AchievementsModel", () => ({
    achievementContent: {
        heading: "Your Achievements"
    }
}))

vi.mock("src/utils/achievementIcon", () => ({
    getIcon: mockGetIcon
}))

type routeHandler = (
    url: string, 
) => {
    ok: boolean;
    json: () => Promise<any>
} | null;

let handlers: routeHandler[] = [];

function jsonRes(ok: boolean, body: any) {
    return {
        ok, json:async() => body
    }
}

function defaultHandlers(): routeHandler[] {
    return [
        (url) => (url === "/api/achievements/me" ? jsonRes(true, []) : null),
        (url) => (url ==="/api/achievements" ? jsonRes(true, []) : null),
    ]
}

function setMockFetch() {
    (globalThis as any).fetch = vi.fn(async(url:string, init?: RequestInit) => {
        for (const h of handlers) {
            const res = h(url);
            if (res) {
                return res as Response;
            }
        }
        return jsonRes(false, {}) as unknown as Response;
    })
}

beforeEach(() => {
    handlers = defaultHandlers();
    setMockFetch();
    mockUseAuth.mockReturnValue({token: 'tokenTest'});
    mockGetIcon.mockClear();
    vi.spyOn(console, 'error').mockImplementation(() => {});
})

afterEach(() => {
    vi.restoreAllMocks(); 
})

describe('AchievementsViewModelFunc - intial load', () => {
    it('does not fetch and stays loading when there is no token', () => {
        mockUseAuth.mockReturnValue({token: null});
        const {result} = renderHook(() => AchievementsViewModelFunc());
        expect(result.current.isLoading).toBe(true);
        expect(fetch).not.toHaveBeenCalled();
    })

    it('exposes static content object regardless  of load state', () => {
        const {result} = renderHook(() => AchievementsViewModelFunc());
        expect (result.current.content).toEqual({heading: 'Your Achievements'})
    })

    it('maps earned achievements with the icon and earnedAt date, most recent on top', async () => {
        handlers.unshift((url) =>
            url === "/api/achievements/me" ?jsonRes(true, [
                {
                    achievement_id: 'a1',
                    achievement_name: 'First Win',
                    description: 'Won first match',
                    earned_at: '2026-01-01'
                },
                {
                    achievement_id: 'a2',
                    achievement_name: 'Ten Wins',
                    description: 'Won ten matches',
                    earned_at: '2026-05-02'
                },
            ]) : null
        )

        handlers.unshift((url) => 
            url === "/api/achievements" ? jsonRes(true, [
                {
                    achievement_id: 'a1',
                    achievement_name: 'First Win',
                    description: 'Won first match',
                    earned_at: '2026-01-01'
                },
                {
                    achievement_id: 'a2',
                    achievement_name: 'Ten Wins',
                    description: 'Won ten matches',
                    earned_at: '2026-05-02'
                },
            ]) : null
        )
        const {result} = renderHook(() => AchievementsViewModelFunc());
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.earned.map((a) => a.id)).toEqual(['a2','a1']);
        expect(result.current.earned[0]).toEqual(
            {
                id: 'a2',
                name: 'Ten Wins',
                description: 'Won ten matches',
                icon: 'icon:Ten Wins',
                earnedAt: '2026-05-02'
            },
        )
        expect(mockGetIcon).toHaveBeenCalledWith('First Win');
        expect(mockGetIcon).toHaveBeenCalledWith('Ten Wins');
    } )
})