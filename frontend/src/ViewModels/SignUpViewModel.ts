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
}

export function SignUpViewModelFunction {

}