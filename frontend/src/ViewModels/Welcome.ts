import { useCallback } from "react";

interface WelcomeProps {
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