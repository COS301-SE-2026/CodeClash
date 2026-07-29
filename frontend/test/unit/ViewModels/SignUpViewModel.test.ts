import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import {SignUpViewModelFunction} from "../../../src/ViewModels/SignUpViewModel"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../src/context/Auth/hooks/useAuth";


const mock_nav = vi.fn();
vi.mock('react-router', () => ({  //apparently there is a security issue with react-router-dom so i am making this react-router
    useNavigate: () => mock_nav
}))

vi.mock('../../../src/context/Auth/hooks/useAuth');

