export interface WelcomeStyle {
    className: string;
}

export interface WelcomeText {
    text: string;
    style: WelcomeStyle;
}

export interface WelcomeContent {
    eyebrow: WelcomeText;
    title: WelcomeText;
    tagline: WelcomeText;
}

export interface WelcomeActions {
    onSignIn?: () => void;
    onSignUp?: () => void;
}

