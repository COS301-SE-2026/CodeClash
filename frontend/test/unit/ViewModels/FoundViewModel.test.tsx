
import { describe, vi } from "vitest";
import { useFound } from "src/ViewModels/FoundViewModel";
import { useSocket } from "src/context/Socket/hooks/useSocket";
import { useMatchmakingSocket, matchAccepted, matchDeclined } from "src/context/Socket/hooks/useMatchmakingSocket";
import { renderHook } from "@testing-library/react";
import { act } from "react";

vi.mock('src/context/Socket/hooks/useSocket');
vi.mock('src/context/Socket/hooks/useMatchmakingSocket')

const mock_nav = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mock_nav,
}))

describe("Testing found view model", () => {


    const mock_socket = {
        on: vi.fn(),
        off: vi.fn(),
        emit: vi.fn()
    }

    vi.mocked(useSocket).mockReturnValue({ socket: mock_socket } as any);
    vi.mocked(useMatchmakingSocket).mockReturnValue({
        game_mode: 'prog',
        pair_id: "12345ABCDE"
    } as any);

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
            result.current.accept();
        });

        expect(matchAccepted).toHaveBeenCalledWith(mock_socket, '12345ABCDE');
        expect(result.current.loading).toBe(true);
    })

    it("Test gameReady navigation", () => {

    })

    it("Tests gameDecline navigation for the declining user", () => {

    })

})