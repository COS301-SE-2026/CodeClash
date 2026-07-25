export interface ForgotPasswordContent {
    titleRequest: string;
    taglineRequest: string;
    emailPlaceholder: string;
    labelSendCode: string;
    titleReset: string;
    taglineReset: (email: string) => string;
    codePlaceholder: string;
    newPasswordPlaceholder: string;
    confirmPasswordPlaceholder: string;
    labelConfirm: string;
    messageSuccess: string;
}

export interface ForgotPasswordForm {
    email: string;
}

export interface ResetPasswordForm {
    code: string;
    newPassword: string;
    confirmPassword: string;
}

export const forgotPasswordContent: ForgotPasswordContent = {
    titleRequest: 'Forgot Password?',
    taglineRequest: 'Enter your email address, and recieve a code to reset your password.',
    emailPlaceholder: 'Email address',
    labelSendCode: 'Send code',
    titleReset: 'Reset Password',
    taglineReset: (email:string) => `Enter the code sent to ${email}`,
    codePlaceholder: 'Reset code',
    newPasswordPlaceholder: 'New password',
    confirmPasswordPlaceholder: 'Confirm new password',
    labelConfirm: 'Confirm',
    messageSuccess: 'Your password has been changed successfully. You may now log in.',
};

export const forgotPasswordForm: ForgotPasswordForm = {
    email: '',
};

export const resetPasswordForm: ResetPasswordForm = {
    code: '',
    newPassword: '',
    confirmPassword: '',
};

export function validateForgotPasswordForm(data: ForgotPasswordForm): string | null {
    if (!data.email.trim()) return 'Email is required';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(data.email.trim())) return 'Please enter a valid email address';

    return null;
}

export function validateResetPassword(data: ResetPasswordForm):string | null {
    if (!data.code.trim()) return 'Reset code is required';
    if (!data.newPassword) return 'New password is required';
    if (data.newPassword.length < 8) return 'Password must be at lease 8 characters';

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if(!passwordRegex.test(data.newPassword)) return 'Password must contain uppercase, lowercase and atlease one number';

    if(!data.confirmPassword) return 'Please confirm your password';
    if (data.newPassword !== data.confirmPassword) return 'Passwords do not match';

    return null;
}