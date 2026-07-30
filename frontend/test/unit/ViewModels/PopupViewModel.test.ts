import {beforeEach, describe, vi} from "vitest"
import { renderHook } from "@testing-library/react"
import { act } from "react"
import { useSocket } from "../../../src/context/Socket/hooks/useSocket"
import { useUser } from "../../../src/context/User/hooks/useUser"
import { useSelectTopic } from "../../../src/ViewModels/PopUpViewModel"


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
    vi.mocked(useSocket).mockReturnValue({socket : mockSocket, isConnected: true, matched: null}) as unknown as ReturnType<typeof useSocket>);
    vi.mocked(useUser).mockReturnValue({ elo: 600} as ReturnType<typeof useUser>);

});

