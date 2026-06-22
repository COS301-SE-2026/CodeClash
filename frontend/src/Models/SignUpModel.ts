export interface SignUpForm {
    username: string;
    firstName: string;
    lastName: string;
    email: string; 
    password: string;
    acceptedTerms: boolean;
}

export interface SignUpContent {
    title: string;
    tagline: string;
    confirmTitle: string,
    confirmTagline: (email: string) => string;
}

export const signUpContent: SignUpContent = {
    title: 'Create Your Account',
    tagline: 'Build your skills. Earn your rank.',
    confirmTitle: 'Please verify your email',
    confirmTagline: (email: string) => 'Enter the code sent to ${email}',
}

