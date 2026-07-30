import {beforeEach, describe, it, vi, expect} from "vitest"
import { renderHook } from "@testing-library/react"
import { act } from "react"
import { useSocket } from "../../../src/context/Socket/hooks/useSocket"
import { useUser } from "../../../src/context/User/hooks/useUser"
import { useSelectTopic } from "../../../src/ViewModels/PopUpViewModel"
import { joinMatchQueue } from "../../../src/context/Socket/hooks/useMatchmakingSocket"
import MatchmakingUserDTO from "../../../src/dtos/matchmaking.dto"


const mock_nav = vi.fn();
vi.mock('react-router', () => ({
    useNavigate: () => mock_nav,
}))

vi.mock('../../../src/context/Socket/hooks/useSocket', () => ({
    useSocket: vi.fn()
})) 

vi.mock('../../../src/context/User/hooks/useUser', () => ({
    useUser: vi.fn()
}))

const mockSocket = {id : 'mock-socket'} as unknown as ReturnType<typeof useSocket>['socket']; //typing as unknown first forces TypeScript to bypass type checking so any mock data, even incomplete objects, can be injected eventually into this mock object which is a safe practise when doing unit tests

beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSocket).mockReturnValue({socket : mockSocket, isConnected: true, matched: {game_mode: 'maths', pair_id: '01234VWXYZ'}});
    vi.mocked(useUser).mockReturnValue({ elo: 600} as ReturnType<typeof useUser>);

});

describe('useSelectTopic', () => {
    it('throws an error if there is no active socket', async () => {
        vi.mocked(useSocket).mockReturnValue({socket : null, isConnected : false, matched : null}); //creates a socket that is not active
        const { result } = renderHook(() => useSelectTopic());

        await expect(act( () => result.current('maths'))).rejects.toThrow('500 Internal Server Error');
        expect(joinMatchQueue).not.toHaveBeenCalled();
        expect(mock_nav).not.toHaveBeenCalled();
    });

    it('creates new dto with selected topic, then joins match queue', async () => {

        const { result } = renderHook(() => useSelectTopic());

        await act( () => result.current('maths'));
        expect(MatchmakingUserDTO).toHaveBeenCalledWith(600, 'maths');
        expect(joinMatchQueue).toHaveBeenCalledWith(mockSocket, vi.mocked(MatchmakingUserDTO));
        expect(mock_nav).toHaveBeenCalledWith('/match-searching');

    });
});

