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
    handleConfirm: () => void;
    handleCancel: () => void;
}

export function ConfirmationViewModelFunction({
    onConfirm, onCancel,
}: ConfirmationViewModelProps) : ConfirmationViewModel {
    const [isVisible, setIsVisible] = useState(false);

    const handleConfirm = useCallback(() => { //when user presses submit
        setIsVisible(false);
        onConfirm();
    },[ onConfirm]);

    const handleCancel = useCallback(()=> {
        setIsVisible(false);
        if (onCancel) onCancel();
    }, [onCancel]);

    return {
        content: confirmationContent,
        isVisible,
        handleConfirm,
        handleCancel,
    };
}