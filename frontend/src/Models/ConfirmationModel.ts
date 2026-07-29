export interface ConfirmationContent {
    title: string;
    message: string;
    confirmLabel: string;
    cancelLabel: string;
    dontAskAgainLabel: string;
}

export const confirmationContent: ConfirmationContent = {
    title: 'Are you sure?',
    message: 'You are about to submit your answer. This action cannot be undone.',
    confirmLabel: 'Submit',
    cancelLabel: 'Cancel',
    dontAskAgainLabel: "Don't ask me again",
};