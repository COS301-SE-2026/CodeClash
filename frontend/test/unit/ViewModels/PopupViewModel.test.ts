import {describe, vi} from "vitest"
import { renderHook } from "@testing-library/react"
import { act } from "react"
import { useSocket } from "../../../src/context/Socket/hooks/useSocket"


const mock_nav = vi.fn();
vi.mock('react-router', () => ({
    useNavigate: () => mock_nav,
}))

vi.mock('../../../src/context/Socket/hooks/useSocket', () => ({
    useSocket: vi.fn()
})) 