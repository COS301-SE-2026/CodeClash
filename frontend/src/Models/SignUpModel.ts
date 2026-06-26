export interface SignUpForm {
    username: string;
    firstName: string;
    lastName: string;
    email: string; 
    phoneNumber: string;
    password: string;
    acceptedTerms: boolean;
}

export interface SignUpContent {
    title: string;
    tagline: string;
    confirmTitle: string,
    confirmTagline: (email: string) => string;
}

export const SignUpRoutes = {
    termsAndConditions: '/terms',
};

export const signUpContent: SignUpContent = {
    title: 'Create Your Account',
    tagline: 'Build your skills. Earn your rank.',
    confirmTitle: 'Please verify your email',
    confirmTagline: (email: string) => `Enter the code sent to ${email}`,
};

export const formData: SignUpForm = {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    acceptedTerms: false,
};

export function validateSignUpForm(data: SignUpForm): string | null {
    if (!data.username.trim()) return 'Username is required';
    if (!data.firstName.trim()) return 'First name is required';
    if (!data.lastName.trim()) return 'Last name is required';
    if(!data.email.trim()) return 'Email is required';
    if (!data.phoneNumber.trim()) return 'Phone number is required';
    if (!data.password || data.password.length < 8) return 'Password must be atleast 8 characters';
    if (!data.acceptedTerms) return 'Please accept the terms and conditions';
    return null;
}