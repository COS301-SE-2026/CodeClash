import { useCallback } from "react";

interface WelcomeViewModelProps {
    onSignIn?: () => void;
    onSignUp?: () => void;
}

interface WelcomeViewModel {
    heroText: {
        eyebrow: string; 
        title: string;
        tagline: string;
    };
    handleSignIn: () => void;
    handleSignUp: () => void;
}

export function WelcomeViewModelFunction (
    { onSignIn, onSignUp, }: 
    WelcomeViewModelProps): WelcomeViewModel {

    const handleSignIn = useCallback(() => 
    {
        onSignIn?.();
    }, [onSignIn]);

    const handleSignUp = useCallback(() =>
    {
        onSignUp?.();
    }, [onSignUp]);

    return {
        heroText: {
            eyebrow: 'Welcome to',
            title: 'CodeClash Gaming',
            tagline: 'Code. Calculate. Conquer.',
        },
        handleSignIn,
        handleSignUp,
    };
}