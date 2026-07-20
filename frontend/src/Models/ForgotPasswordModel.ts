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