import { useCallback, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { signUpContent, formData, validateSignUpForm } from "../Models/SignUpModel";
import type { SignUpContent, SignUpForm } from "../Models/SignUpModel";

export interface SignUpViewModelProps {
    onSignIn?: () => void;
    onBack?: () => void;
}

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

        const [form, setForm] = useState<SignUpForm>(formData);
        const [confirmationCode, setConfirmationCode] = useState('');
        const [needsConfirmation, setNeedsConfirmation] = useState(false);
        const [localError, setLocalError] = useState<string | null>(null);
        const [resendMessage, setResendMessage] = useState<string | null>(null);

        const setField = useCallback ((field: keyof SignUpForm, value: string | boolean) =>
        {
            setForm(prev => ({ ...prev, [field]: value})); //...prev will keep all exisiting values untouched and allow changes only to a specific field
        }, []);

        const handleSubmit = useCallback(async () =>
        {
            clearError();
            setLocalError(null);
            const validationError = validateSignUpForm(form);
            if (validationError) {
                setLocalError(validationError);
                return;
            }
            try {
                await signUp ({ //If the form validation is passed, call Amplify's signUp with the values for the form
                    username: form.username.trim(),
                    firstName: form.firstName,
                    lastName: form.lastName,
                    email: form.email.trim(),
                    phoneNumber: form.phoneNumber.trim(),
                    password: form.password,
                });
                setNeedsConfirmation(true); //If signUp succeeds, set UI to confirmation code screen
            } catch {} //If Amplify throws an error, AuthContext will catch it and put it in error
        }, [form, signUp, clearError]); //Dependency array

        const handleConfirm = useCallback(async () =>
        {
            clearError();
            setLocalError(null);
            if (!confirmationCode.trim()) {
                setLocalError('Confirmation code is required'); //If the code is empty then give the user an error message and stop
                return;
            }
            try {
                await confirmSignUp (form.username.trim(), confirmationCode.trim()); //If the validation is passed, Amplify will be called
                onSignIn?.(); //If confirmation is successful, go to the SignIn page if it exists
            } catch {}
        }, [confirmationCode, form.username, confirmSignUp, clearError, onSignIn]); //Dependency array

        return {
            content: signUpContent,
            form,
            confirmationCode,
            needsConfirmation,
            displayError: localError ?? error,
            resendMessage,
            isLoading,

            setField,
            setConfirmationCode,
            handleSubmit,
            handleConfirm,
        };
    }