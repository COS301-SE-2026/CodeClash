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