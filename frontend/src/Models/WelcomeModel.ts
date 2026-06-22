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

export const welcomeContent: WelcomeContent = {
    eyebrow: {
        text: 'Welcome to',
        style: {className: 'heading'},
    },

    title: {
        text: 'CodeClash Gaming',
        style: {className: 'heading-big'},
    },

    tagline: {
        text: 'Code. Calculate. Conquer.',
        style: {className: 'heading-sub'},
    },
};