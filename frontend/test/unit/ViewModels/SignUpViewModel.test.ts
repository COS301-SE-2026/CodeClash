import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import {SignUpViewModelFunction} from "../../../src/ViewModels/SignUpViewModel"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../src/context/Auth/hooks/useAuth";
import { SignUpForm } from "../../../src/Models/SignUpModel";


const mock_nav = vi.fn();
vi.mock('react-router', () => ({  //apparently there is a security issue with react-router-dom so i am making this react-router
    useNavigate: () => mock_nav
}))

vi.mock('../../../src/context/Auth/hooks/useAuth');

const validForm: SignUpForm = {
    username: 'theegirlboss',
    firstName: 'Morgs',
    lastName: 'Cal',
    email: 'mcal@example.com',
    phoneNumber: '0123456789',
    password: 'Password1!',
    acceptedTerms: true
};

