import React from "react";
import { AlertTriangle } from "lucide-react";
import { ConfirmationViewModelFunction } from "../ViewModels/ConfirmationViewModel";
import type {ConfirmationViewModelProps} from '../ViewModels/ConfirmationViewModel'

const ConfirmationPopup: React.FC<ConfirmationViewModelProps> = ({onConfirm, onCancel}) => {
    const {
        content,
        isVisible, dontAskAgain, handleDontAsk,
        showConfirm, handleConfirm, handleCancel,
    } = ConfirmationViewModelFunction({onConfirm, onCancel});

    if (!isVisible) return null;
    return (
        <div>
            
        </div>
    );
};

export {ConfirmationViewModelFunction};
export default ConfirmationPopup;