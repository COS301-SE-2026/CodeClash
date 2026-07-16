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