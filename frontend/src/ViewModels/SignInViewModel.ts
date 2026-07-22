import { useCallback, useState } from "react";
import { useAuth } from "src/context/useAuth";
import { signInContent, formData, validateSignInForm } from "../Models/SignInModel";
import type { SignInForm, SignInContent } from "../Models/SignInModel";
import { useNavigate } from "react-router-dom";

export function SignInViewModelFunction() {
        const { signIn, error, clearError, isLoading} = useAuth();

        const [form, setForm] = useState<SignInForm>(formData);
        const [localError, setLocalError] = useState<string | null>(null);
        const nav = useNavigate();

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
                nav('/dashboard')
            } catch {}
        }, [form, signIn, clearError]); //Dependency array

        return {
            content: signInContent,
            form,
            displayError: localError ?? error,
            isLoading,
            setField,
            handleSubmit,
        };
    }