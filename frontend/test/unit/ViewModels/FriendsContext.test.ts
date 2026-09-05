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