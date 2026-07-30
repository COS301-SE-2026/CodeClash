import {beforeEach, describe, vi} from "vitest"
import { renderHook } from "@testing-library/react"
import { act } from "react"
import { useSocket } from "../../../src/context/Socket/hooks/useSocket"
import { useUser } from "../../../src/context/User/hooks/useUser"


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

const mockSocket = 

beforeEach(() => {
    vi.clearAllMocks();

})

