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

export function SignInViewModelFunction(
    {onSignInSuccess,}:
    SignInViewModelProps): SignInViewModel {
        const { signIn, error, clearError, isLoading} = useAuth();

        const [form, setForm] = useState<SignInForm>(formData);
        const [localError, setLocalError] = useState<string | null>(null);

        const setField = useCallback((field: keyof SignInForm, value:string) => 
        {
            setForm(prev => ({...prev, [field]: value}));
        }, []);
    }