import { useState, useCallback } from "react";
import { confirmationContent } from "../Models/ConfirmationModel";
import type { ConfirmationContent } from "../Models/ConfirmationModel";

export interface ConfirmationViewModelProps {
    onConfirm: () => void;
    onCancel?: () => void;
}

export interface ConfirmationViewModel {
    content: ConfirmationContent;
    isVisible: boolean;
    dontAskAgain: boolean;
    showConfirm: () => void;
    handleConfirm: () => void;
    handleCancel: () => void;
    handleDontAsk: (checked: boolean) => void;
    resetRound: ()=> void;
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
            return;
        }
        else {
            setIsVisible(true); //otherwise the popup will come on every submit for the round
        }
    }, [suppressedRound, onConfirm]);

    const handleConfirm = useCallback(() => { //when user presses submit
        if (dontAskAgain) { //if on the submit, they pressed not to show the popup again, the the popup will be suppressed for the round
            setSuppressedRound(true);
        }
        setIsVisible(false);
        onConfirm();
    },[dontAskAgain, onConfirm]);

    const handleCancel = useCallback(()=> {
        setIsVisible(false);
        if (onCancel) onCancel();
    }, [onCancel]);

    const handleDontAsk = useCallback((checked:boolean) => {
        setDontAskAgain(checked);
    }, []);

    const resetRound = useCallback(() => { //for the start of any new game, if they want it not to show in the round they will have to select dont show again
        setSuppressedRound(false);
        setDontAskAgain(false);
    },[]);

    return {
        content: confirmationContent,
        isVisible,
        dontAskAgain,
        showConfirm,
        handleConfirm,
        handleCancel,
        handleDontAsk,
        resetRound,
    };
}