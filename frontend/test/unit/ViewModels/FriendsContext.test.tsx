import React, {useContext} from "react";
import {renderHook, act, waitFor} from "@testing-library/react";
import {describe, it, expect, beforeEach, afterEach, vi} from "vitest";

import {FriendsProvider, FriendsContextFunc} from '../../../src/ViewModels/FriendsViewModel/FriendsContext';

const {mockUseAuth, mockUseSocket} = vi.hoisted(() => ({
    mockUseAuth: vi.fn(),
    mockUseSocket: vi.fn()
}))

vi.mock("src/context/Auth/hooks/useAuth", () => ({
    useAuth: mockUseAuth
}))

vi.mock("src/context/Socket/hooks/useSocket", () => ({
    useSocket: mockUseSocket
}))

vi.mock("src/Models/FriendsModel", () => ({
    friendContent: {
        inviteInvalid: 'This invite is no longer valid'
    }
}))

type routeHandler = (
    url: string, 
    init?: RequestInit
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
        (url) => (url === "/api/friends" ? jsonRes(true, []) : null),
        (url) => (url.startsWith ("/api/friends/requests") ? jsonRes(true, []) : null),
        (url) => (url === "/api/user/avatar_id" ? jsonRes(true, {avatar_id: 3}) : null),
        (url) => (url === "/api/user/league" ? jsonRes(true, {league: "Venus"}) : null),
        (url) => (url.startsWith ("/api/user/search") ? jsonRes(true, []) : null),
        (url) => (url === "/api/friends/invite" ? jsonRes(true, {invite_code: "Venus", expires_at: Date.now()}) : null),
        (url) => (url === "/api/friends/request" ? jsonRes(true, {}) : null),
        (url) => (/^\/api\/friends\/request\/.+/.test(url) ? jsonRes(true, {}) : null),
    ]
}

function setMockFetch() {
    (globalThis as any).fetch = vi.fn(async(url:string, init?: RequestInit) => {
        for (const h of handlers) {
            const res = h(url, init);
            if (res) {
                return res as Response;
            }
        }
        return jsonRes(false, {}) as unknown as Response;
    })
}

function renderFriends() {
    return renderHook(() => useContext(FriendsContextFunc), {
        wrapper: ({children}: {children: React.ReactNode}) => (
            <FriendsProvider>{children}</FriendsProvider>
        )
    })
}

const base = {
    userId: 'u1', 
    username: 'TestUser'
}

beforeEach(() => {
    handlers = defaultHandlers();
    setMockFetch();
    mockUseAuth.mockReturnValue({token: 'tokenTest', user: base});
    mockUseSocket.mockReturnValue({socket: {emit: vi.fn()}});
    vi.spyOn(console, 'error').mockImplementation(() => {});
})

afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks(); 
})

it('loads and maps friends, requests and header profile', async () => {
    handlers.unshift((url) => 
        url === "/api/friends" ? jsonRes(true, [{
            user_id: 'id1', username: 'usersname1',
            avatar_id: 2, elo: 888
        }]) : null
    )
    handlers.unshift((url) => 
        url.startsWith("/api/friends/requests") ? jsonRes(true, [{
            friendship_id: 'id2', username: 'friends2', 
            avatar_id: 5, created_at: '2024-05-05', user_id: 'user2'
        }]): null
    )
    const {result} = renderFriends();
    await waitFor(() => expect(result.current?.isLoading).toBe(false));

    expect(result.current?.friend).toEqual([{
        id: 'id1', username: 'usersname1', avatar: 2, status: 'offline', elo: 888
    }])
    expect(result.current?.requests).toEqual([{
        id: 'id2', username: 'friends2', avatar: 5, sentAt: '2024-05-05', fromUser: 'user2'
    }])
    expect(result.current?.profile).toEqual({
        id: 'u1', username: 'TestUser', avatar: 3, league: 'Venus', handle: 'TestUser'
    })
})

it('accepts a request into friends and removes it from requests list', async () => {
    let accepted = false;
    handlers.unshift((url, init) => 
        url === "/api/friends/request/f1" && init?.method === 'PATCH' ? (accepted = true, jsonRes(true, {})) :null
    )

    handlers.unshift((url) => 
        url ==="/api/friends" ? jsonRes(true, accepted? [{
            user_id: 'friendUserId', username: 'friendUsername', avatar_id: 7, elo: 600
        }]: []) : null
    )

    handlers.unshift((url) => 
        url.startsWith("/api/friends/requests") ? jsonRes(true, accepted? [] : [{
            friendship_id: 'f1', username: 'friendUsername', avatar_id: 7, created_at: '2022-02-02', user_id: 'friendUserId'
        }]) : null
    )
    const {result} = renderFriends();
    await waitFor(() =>expect(result.current?.isLoading).toBe(false));
    await act(async() => await result.current?.acceptRequest('f1'));

    expect(fetch).toHaveBeenCalledWith("/api/friends/request/f1", expect.objectContaining({
        method: 'PATCH', body: JSON.stringify({
            status: 'accepted'
        })
    }));
    expect(result.current?.requests).toEqual([]);
    expect(result.current?.friend).toContainEqual({
        id: 'friendUserId', username: 'friendUsername', avatar: 7, status: 'offline',elo: 600
    })
})

it('declines a request and removes it from requests list', async () => {
    let declined = false;
    handlers.unshift((url, init) => 
        url === "/api/friends/request/f2" && init?.method === 'PATCH' ? (declined = true, jsonRes(true, {})) :null
    )

    handlers.unshift((url) => 
        url.startsWith("/api/friends/requests") ? jsonRes(true, declined? [] : [{
            friendship_id: 'f2', username: 'friendUsername2', avatar_id: 7, created_at: '2022-05-05', user_id: 'friendUserId2'
        }]) : null
    )
    const {result} = renderFriends();
    await waitFor(() =>expect(result.current?.isLoading).toBe(false));
    await act(async() => await result.current?.declineRequest('f2'));

    expect(fetch).toHaveBeenCalledWith("/api/friends/request/f2", expect.objectContaining({
        method: 'PATCH', body: JSON.stringify({
            status: 'declined'
        })
    }));
    expect(result.current?.requests).toEqual([]);
})