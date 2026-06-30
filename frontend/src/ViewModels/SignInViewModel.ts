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

        const handleSubmit = useCallback(async () => 
        {
            clearError();
            setLocalError(null);
            const validationError = validateSignInForm(form);
            if (validationError) {
                setLocalError(validationError);
                return;
            }
            try {
                await signIn ( //If validation is passed, Amplifys sign in will be called
                    form.email.trim(), 
                    form.password,
                );
                onSignInSuccess?.();
            } catch {}
        }, [form, signIn, clearError, onSignInSuccess]); //Dependency array

        return {
            content: signInContent,
            form,
            displayError: localError ?? error,
            isLoading,
            setField,
            handleSubmit,
        };
    }