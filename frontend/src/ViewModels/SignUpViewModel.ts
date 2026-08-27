import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/Auth/hooks/useAuth";
import { formData } from "../Models/SignUpModel";
import type { SignUpForm } from "../Models/SignUpModel";
import axios from "axios";
import { fetchAuthSession} from "aws-amplify/auth";


export function validateSignUpForm(data: SignUpForm): string | null {
    if (!data.username.trim()) return 'Username is required';
    if (!data.firstName.trim()) return 'First name is required';
    if (!data.lastName.trim()) return 'Last name is required';
    if (!data.email.trim()) return 'Email is required';
    if (!data.phoneNumber.trim()) return 'Phone number is required';
    if (!data.password || data.password.length < 8) return 'Password must be atleast 8 characters';
    if (!data.acceptedTerms) return 'Please accept the terms and conditions';
    return null;
}

export function SignUpViewModelFunction() {

    const { signUp, confirmSignUp, resendSignUpCode, error, clearError, isLoading , signIn} = useAuth();
    const [form, setForm] = useState<SignUpForm>(formData);
    const [confirmationCode, setConfirmationCode] = useState('');
    const [needsConfirmation, setNeedsConfirmation] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);
    const [resendMessage, setResendMessage] = useState<string | null>(null);
    const [signupData, setSignupData] = useState<SignUpForm | null>(null);
    const nav = useNavigate();


    const setField = useCallback((field: keyof SignUpForm, value: string | boolean) => {
        setForm(prev => ({ ...prev, [field]: value })); //...prev will keep all exisiting values untouched and allow changes only to a specific field
    }, []);

    const handleSubmit = useCallback(async () => {
        clearError();
        setLocalError(null);
        const validationError = validateSignUpForm(form);
        if (validationError) {
            setLocalError(validationError);
            return;
        }
        try {

            const data: SignUpForm = {
                username: form.username.trim(),
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email.trim(),
                phoneNumber: form.phoneNumber.trim(),
                password: form.password,
                acceptedTerms: form.acceptedTerms
            }
            await signUp(data);
            setSignupData(data);
            setNeedsConfirmation(true); //If signUp succeeds, set UI to confirmation code screen
        } catch {
            console.error("Sign up error")
        } //If Amplify throws an error, AuthContext will catch it and put it in error
    }, [form, signUp, clearError]); //Dependency array

    const handleConfirm = useCallback(async () => {
        clearError();
        setLocalError(null);
        if (!confirmationCode.trim()) {
            setLocalError('Confirmation code is required.'); //If the code is empty then give the user an error message and stop
            return;
        }
        try {
            await confirmSignUp(form.username.trim(), confirmationCode.trim()); //If the validation is passed, Amplify will be called
            await signIn(form.email.trim(), form.password.trim());

            const session = await fetchAuthSession({ forceRefresh: true });
            const token = session.tokens?.idToken?.toString();


            const req_data = {
                username: signupData?.username,
                email: signupData?.email
            }
            axios.post(`/api/user/create-user`, req_data, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((res) => {
                    if (res.status === 200) {
                        nav('/dashboard');
                    }
                    else {
                        throw new Error("Error creating user.");
                    }
                })
        } catch {
            console.error("Sign up confirmation error")
        }
    }, [confirmationCode, form.username, confirmSignUp, clearError, nav]); //Dependency array

    const handleResend = useCallback(async () => {
        clearError();
        setLocalError(null);
        setResendMessage(null); //Clear any previous message for code sent, to show that is being resent
        try {
            await resendSignUpCode(form.username.trim()); //Amplify called to send a confirmation code. The user is id'd by username.
            setResendMessage('Code has been sent! Check your email.'); //If code has been sent, set the success message.
        } catch {
            console.error("Error resending code")
        }
    }, [form.username, resendSignUpCode, clearError]); //Dependancy array

    return {
        form,
        confirmationCode,
        needsConfirmation,
        displayError: localError ?? error,
        resendMessage,
        isLoading,

        setField,
        setConfirmationCode,
        handleSubmit,
        handleConfirm,
        handleResend,
    };
}