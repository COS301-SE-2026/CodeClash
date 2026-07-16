import { useState, useCallback } from "react";
import { confirmationContent } from "../Models/ConfirmationModel";
import type { ConfirmationContent } from "../Models/ConfirmationModel";

interface ConfirmationViewModelProps {
    onConfirm: () => void;
    onCancel: () => void;
}

interface ConfirmationViewModel {
    content: ConfirmationContent;
    isVisible: boolean;
    dontAskAgain: boolean;
    showConfirm: () => void;
    handleConfirm: () => void;
    handleCancel: () => void;
    handleDontAsk: (checked: boolean) => void;
}

export function ConfirmationViewModelFunction({
    onConfirm, onCancel,
}: ConfirmationViewModelProps) : ConfirmationViewModel {
    const [isVisible, setIsVisible] = useState(false);
    const [dontAskAgain, setDontAskAgain] = useState(false);
    const [suppressedRound, setSuppressedRound] = useState(false);

    const showConfirm = useCallback(() => { //determines whether the popup should be shown
        if (suppressedRound) { //if the user has decided not to see the popup for each question submission in the round, confirm will immediately execute
            onConfirm();
        }
        else {
            setIsVisible(true); //otherwise the popup will come on every submit for the round
        }
    }, [suppressedRound, onConfirm]);

    return {
        content: confirmationContent,
        isVisible,
        dontAskAgain,
        showConfirm,
        handleConfirm,
        handleCancel,
        handleDontAsk,
    };
}