import { useCallback, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { signUpContent, formData, validateSignUpForm } from "../Models/SignUpModel";
import type { SignUpContent, SignUpForm, SignUpActions } from "../Models/SignUpModel";

interface SignUpViewModelProps extends SignUpActions {}

interface SignUpViewModel {
    content: SignUpContent;
    form: SignUpForm;
    confirmationCode: string;
    needsConfirmation: boolean;
    displayError: string | null;
    resendMessage: string | null;
    isLoading: boolean;

    setField: (field: keyof SignUpForm, value: string | boolean) => void;
    setConfirmationCode: (code: string) => void;
    handleSubmit: () => Promise<void>;
    handleConfirm: () => Promise<void>;
    handleResend: () => Promise<void>;
    handleBack: () => void;
}

export function SignUpViewModelFunction (
    {onSignIn, onBack, }:
    SignUpViewModelProps): SignUpViewModel {

        const { signUp, confirmSignUp, resendSignUpCode, error, clearError, isLoading } = useAuth();
    }