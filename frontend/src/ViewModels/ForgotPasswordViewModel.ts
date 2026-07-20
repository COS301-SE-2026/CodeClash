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