
import { describe, vi } from "vitest";
import { useFound } from "src/ViewModels/FoundViewModel";
import { useSocket } from "src/context/Socket/hooks/useSocket";
import { useMatchmakingSocket, matchAccepted, matchDeclined, joinMatchQueue } from "src/context/Socket/hooks/useMatchmakingSocket";
import { renderHook } from "@testing-library/react";
import { act } from "react";
import type { Socket } from "socket.io-client";

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
        return { elo: 600 }
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
        vi.mocked(useSocket).mockReturnValue({ socket: mock_socket as Socket, isConnected: true });
        vi.mocked(useMatchmakingSocket).mockReturnValue({
            game_mode: 'math',
            pair_id: "12345ABCDE"
        } as any);

        handlers.clear();
    })


    it("Verifies listeners are registered correctly", () => {
        renderHook(() => useFound());

        expect(mock_socket.on).toHaveBeenCalledWith('game_ready', expect.any(Function));
        expect(mock_socket.on).toHaveBeenCalledWith('decline_done', expect.any(Function));
        expect(mock_socket.on).toHaveBeenCalledWith('game_declined', expect.any(Function));  
    })


    it("Tests decline for matched users", () => {
        const { result } = renderHook(() => useFound());

        act(() => {
            result.current.decline();
        });

        expect(matchDeclined).toHaveBeenCalledWith(mock_socket, '12345ABCDE');
        expect(result.current.loading).toBe(true);
    })

    it("Tests accept for matched users", () => {
        const { result } = renderHook(() => useFound());

        act(() => {
            result.current.accept()
        })
        expect(matchAccepted).toHaveBeenCalledWith(mock_socket, '12345ABCDE');
        expect(result.current.loading).toBe(true);
    })

    it("Test gameReady navigation", () => {
        const { result } = renderHook(() => useFound())

        act(() => {
            result.current.accept()
        })

        act(() => {
            handlers.get("game_ready")!();
        })

        expect(result.current.loading).toBe(false);
        expect(mock_nav).toHaveBeenCalledWith('math-match');
    })

    it("Tests declineGame navigation for the declining user", () => {
        

    })

})