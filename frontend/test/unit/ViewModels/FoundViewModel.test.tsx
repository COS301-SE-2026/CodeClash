
import { renderHook } from "@testing-library/react";
import { act } from "react";
import type { Socket } from "socket.io-client";
import { describe, vi, it, beforeEach, expect } from "vitest";

import { useMatchmakingSocket, matchAccepted, matchDeclined, joinMatchQueue } from "../../../src/context/Socket/hooks/useMatchmakingSocket";
import { useSocket } from "../../../src/context/Socket/hooks/useSocket";
import MatchmakingUserDTO from "../../../src/dtos/matchmaking.dto";
import { MatchFoundViewModelFunction } from "../../../src/ViewModels/MatchFoundViewModel";

vi.mock('src/context/Socket/hooks/useSocket', () => ({
    useSocket: vi.fn()
}));

vi.mock('src/context/Socket/hooks/useMatchmakingSocket', () => ({
    useMatchmakingSocket: vi.fn(),
    joinMatchQueue: vi.fn(),
    matchAccepted: vi.fn(),
    matchDeclined: vi.fn(),
}))

vi.mock('src/context/User/hooks/useUser', () => ({
    useUser: () => {
        return { elo: 600, league: "Mercury" }
    },

}))

const mock_nav = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mock_nav,
}))

const handlers = new Map<string, Function>();

describe("Testing found view model", () => {
    const mock_socket: Partial<Socket> = {
        on: vi.fn((event: string, callback: Function): Socket => {
            handlers.set(event, callback);
            return mock_socket as Socket;
        }),
        off: vi.fn(),
        emit: vi.fn()
    }


    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useSocket).mockReturnValue({ socket: mock_socket as Socket, isConnected: true , matched: {game_mode: 'maths', pair_id: "12345ABCDE"}});
        vi.mocked(useMatchmakingSocket).mockReturnValue({
            game_mode: 'maths',
            pair_id: "12345ABCDE"
        } as any);

        handlers.clear();
    })


    it("Verifies listeners are registered correctly", () => {
        renderHook(() => MatchFoundViewModelFunction());

        expect(mock_socket.on).toHaveBeenCalledWith('game_ready', expect.any(Function));
        expect(mock_socket.on).toHaveBeenCalledWith('decline_done', expect.any(Function));
        expect(mock_socket.on).toHaveBeenCalledWith('game_declined', expect.any(Function));
    })


    it("Tests decline for matched users", () => {
        const { result } = renderHook(() => MatchFoundViewModelFunction());

        act(() => {
            result.current.decline();
        });

        expect(matchDeclined).toHaveBeenCalledWith(mock_socket, '12345ABCDE');
        expect(result.current.loading).toBe(true);
    })

    it("Tests accept for matched users", () => {
        const { result } = renderHook(() => MatchFoundViewModelFunction());

        act(() => {
            result.current.accept()
        })

        const expected = {
            pair_id: '12345ABCDE',
            game_mode: 'maths',
            league: "Mercury"

        }
        expect(matchAccepted).toHaveBeenCalledWith(mock_socket, expected);
        expect(result.current.loading).toBe(true);
    })

    it("Test gameReady navigation", () => {
        const { result } = renderHook(() => MatchFoundViewModelFunction())

        act(() => {
            result.current.accept()
        })

        act(() => {
            handlers.get("game_ready")!({ game_id: 1 });
        })


        expect(result.current.loading).toBe(false);
        expect(mock_nav).toHaveBeenCalledWith('/maths-match', { replace: true, state: { id: 1 } });
    })

    it("Tests declineGame navigation for the declining user", () => {
        renderHook(() => MatchFoundViewModelFunction())

        act(() => {
            handlers.get('decline_done')!();
        })

        expect(mock_nav).toHaveBeenCalledWith('/dashboard');
    })

    it("Tests gameDeclined requeues the declined user", () => {
        renderHook(() => MatchFoundViewModelFunction());

        act(() => {
            handlers.get('game_declined')!();
        })

        const data = new MatchmakingUserDTO(600, 'maths');

        expect(joinMatchQueue).toHaveBeenCalledWith(mock_socket, data);
        expect(mock_nav).toHaveBeenCalledWith('/searching')
    })




    describe("Tests behaviour with a null socker", () => {

        beforeEach(() => {
            vi.mocked(useSocket).mockReturnValue({ socket: null, isConnected: false , matched: null});
        })

        it("Tests that not listeneres are registered when the socket is null", () => {
            renderHook(() => MatchFoundViewModelFunction());

            expect(mock_socket.on).not.toHaveBeenCalled();
        })


        it("Tests accept returns an error when the socket is null", () => {
            const { result } = renderHook(() => MatchFoundViewModelFunction())

            act(() => {
                result.current.accept();
            })

            expect(result.current.socketError).toBe("Disconnected");
        })

        it("Tests decline returns an error when the socket is null", () => {
            const { result } = renderHook(() => MatchFoundViewModelFunction())

            act(() => {
                result.current.decline();
            })

            expect(result.current.socketError).toBe("Disconnected");
        })
    })

})