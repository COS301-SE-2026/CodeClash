import { useCallback, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { signInContent, formData, validateSignInForm } from "../Models/SignInModel";
import type { SignInForm, SignInContent } from "../Models/SignInModel";

export interface SignInViewModelProps {
    onSignInSuccess: () => void;
}

interface SignInViewModel {
    content: SignInContent;
    form: SignInForm;
    displayError: string | null;
    isLoading: boolean;
    setField: (field: keyof SignInForm, value: string) => void;
    handleSubmit: () => Promise<void>;
}

