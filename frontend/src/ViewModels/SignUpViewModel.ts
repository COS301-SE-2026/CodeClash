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
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState<string | null>(null);
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
        setIsSubmitting(true);
        try {
            //Stage one, the only stage where the code itself can be at fault
            try {
                await confirmSignUp(form.username.trim(), confirmationCode.trim()); //If the validation is passed, Amplify will be called
            } catch (err) {
                console.error("Confirmation code rejected", err);
                setLocalError(err instanceof Error ? err.message : 'That confirmation code was not accepted.');
                return;
            }
            setIsConfirmed(true); //the code worked, so stop presenting this screen as a code problem
            setConfirmMessage('Email verified! Setting up your account...');

            //Stage two, none of this is the user's code being wrong
            await signIn(form.email.trim(), form.password.trim());

            const session = await fetchAuthSession({ forceRefresh: true });
            const token = session.tokens?.idToken?.toString();


            const req_data = {
                username: (signupData?.username ?? form.username).trim(),
                email: (signupData?.email ?? form.email).trim()
            }
            const res = await axios.post(`/api/create-user`, req_data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.status !== 200) {
                throw new Error("Error creating user.");
            }
            nav('/dashboard');
        } catch (err) {
            console.error("Account setup after confirmation failed", err);
            setConfirmMessage('Email verified.'); //keep saying so, the verification really did succeed
            setLocalError(`We could not finish setting up your account: ${err instanceof Error ? err.message : 'unknown error'}`);
        } finally {
            setIsSubmitting(false);
        }
    }, [confirmationCode, form.username, form.email, form.password, signupData, confirmSignUp, signIn, clearError, nav]); //Dependency array

    const handleResend = useCallback(async () => {
        clearError();
        setLocalError(null);
        setResendMessage(null); //Clear any previous message for code sent, to show that is being resent
        setIsSubmitting(true);
        try {
            const delivery = await resendSignUpCode(form.username.trim()); //Amplify called to send a confirmation code. The user is id'd by username.
            await resendSignUpCode(form.username.trim()); //Amplify called to send a confirmation code. The user is id'd by username.
            setConfirmationCode(''); // getting rid of the old stale confirmation code so that the new one can work
            const medium = delivery?.deliveryMedium ?? 'UNKNOWN'; //Cognito reports how it claims to have delivered the code
            const destination = delivery?.destination ?? 'your registered address';
          setResendMessage(`Code has been sent! Check your ${medium} at ${destination}.`); //If code has been sent, set the success message.
        } catch {
            console.error("Error resending code")
        } finally {
            setIsSubmitting(false);
        }
    }, [form.username, resendSignUpCode, clearError]); //Dependancy array

    return {
        form,
        confirmationCode,
        needsConfirmation,
        displayError: localError ?? error,
        resendMessage,
        isLoading,
        confirmMessage,
        isConfirmed,
        isSubmitting,

        setField,
        setConfirmationCode,
        handleSubmit,
        handleConfirm,
        handleResend,
    };
}
