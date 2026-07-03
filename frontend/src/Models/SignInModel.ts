export interface SignInForm {
    email: string;
    password: string;
}

export interface SignInContent {
    title: string;
    tagline: string;
}

export const signInContent: SignInContent = {
    title: 'Welcome Back, Challenger',
    tagline: 'Compete in battles, earn badges, and rise through the ranks.',
};

export const formData: SignInForm = {
    email: '',
    password: '',
};

export function validateSignInForm(data: SignInForm): string | null {
    if (!data.email.trim()) return 'Email is required';
    if (!data.password) return 'Password is required';
    return null;
} 