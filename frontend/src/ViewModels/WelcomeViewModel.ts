import { useCallback } from "react";
import { welcomeContent } from '../Models/WelcomeModel';
import type { WelcomeContent, WelcomeActions } from "../Models/WelcomeModel";

interface WelcomeViewModelProps extends WelcomeActions {}

interface WelcomeViewModel {
    content: WelcomeContent;
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
        content: welcomeContent,
        handleSignIn,
        handleSignUp,
    };
}