import {useState, useCallback} from 'react';
import { useAuth } from '../context/AuthContext';
import { forgotPasswordContent, forgotPasswordForm, resetPasswordForm, validateForgotPasswordForm, validateResetPassword } from '../Models/ForgotPasswordModel';
import type { ForgotPasswordContent, ForgotPasswordForm, ResetPasswordForm } from '../Models/ForgotPasswordModel';

export interface ForgotPasswordViewModelProps {
    onSuccess: () => void;
    onBack: () => void;
}

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
    handleBack: () => void;
}

export function ForgotPasswordViewModelFunction ({
    onSuccess, onBack, 
}: ForgotPasswordViewModelProps): ForgotPasswordViewModel {
    const {forgotPassword, confirmForgotPassword, error, clearError, isLoading} = useAuth();

    const [requestForm, setRequest] =useState<ForgotPasswordForm>(forgotPasswordForm);
    const [resetForm, setReset] = useState<ResetPasswordForm>(resetPasswordForm);
    const [state, setState] = useState< 'request' | 'reset' | 'success'>('request');
    const [localError, setLocalError] = useState<string | null>(null);

    return {

    };
}