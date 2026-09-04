export interface SignUpForm {
    username: string;
    firstName: string;
    lastName: string;
    email: string; 
    phoneNumber: string;
    password: string;
    acceptedTerms: boolean;
}

export const SignUpRoutes = {
    termsAndConditions: '/terms',
};

export const confirmCode = (email:string)=> `Enter the code sent to ${email}`;

export const formData: SignUpForm = {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    acceptedTerms: false,
};

