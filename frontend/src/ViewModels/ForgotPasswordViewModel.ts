import {useState, useCallback} from 'react';

import { useAuth } from '../context/Auth/hooks/useAuth';
import { forgotPasswordContent, forgotPasswordForm, resetPasswordForm, validateForgotPasswordForm, validateResetPassword } from '../Models/ForgotPasswordModel';
import type { ForgotPasswordContent, ForgotPasswordForm, ResetPasswordForm } from '../Models/ForgotPasswordModel';

interface ForgotPasswordViewModel {
    content: ForgotPasswordContent;
    requestForm: ForgotPasswordForm;
    resetForm: ResetPasswordForm;
    state: 'request' | 'reset' | 'success';
    displayError: string | null;
    isLoading: boolean;
    setRequest: (field: keyof ForgotPasswordForm, value: string) => void;
    setReset: (field: keyof ResetPasswordForm, value:string) => void;
    handleSendCode: () => Promise<void>;
    handleReset: () => Promise<void>;
}

export function ForgotPasswordViewModelFunction (): ForgotPasswordViewModel {
    const {forgotPassword, confirmForgotPassword, error, clearError, isLoading} = useAuth();

    const [requestForm, setRequestForm] =useState<ForgotPasswordForm>(forgotPasswordForm);
    const [resetForm, setResetForm] = useState<ResetPasswordForm>(resetPasswordForm);
    const [state, setState] = useState< 'request' | 'reset' | 'success'>('request');
    const [localError, setLocalError] = useState<string | null>(null);

    const setRequest = useCallback((field: keyof ForgotPasswordForm, value: string) => {
        setRequestForm(prev => ({ ...prev, [field]: value}));
    }, []);

    const setReset = useCallback((field: keyof ResetPasswordForm, value: string) => {
        setResetForm( prev => ({ ...prev, [field]: value}));
    }, []);

    const handleSendCode = useCallback(async () => {
        clearError();
        setLocalError(null); //clear any previous error and reset the local error to null
        const validationError = validateForgotPasswordForm(requestForm); //run validation on the email form to see if it is valid

        if (validationError) {
            setLocalError(validationError);
            return;
        }

        try {
            await forgotPassword(requestForm.email.trim()); //Amplify will be called to send the verification code to the given email
            setState('reset');
        }
        catch {}
    }, [requestForm, forgotPassword, clearError]); //dependency array for React to create callback

    const handleReset = useCallback(async () => {
        clearError();
        setLocalError(null);
        const validationError = validateResetPassword(resetForm); //validate the code, matching passwords, strong password

        if (validationError) {
            setLocalError(validationError);
            return;
        }

        try { //Amplify will get calledm and if everyhting is correct then the password will be updated to the new password
            await confirmForgotPassword(requestForm.email.trim(), resetForm.code.trim(), resetForm.newPassword,);
            setState('success');
        }
        catch {}
    }, [requestForm.email, resetForm, confirmForgotPassword, clearError]);

    return {
        content: forgotPasswordContent,
        requestForm,
        resetForm,
        state,
        displayError: localError ?? error,
        isLoading,
        setRequest,
        setReset,
        handleSendCode,
        handleReset,
    };
}