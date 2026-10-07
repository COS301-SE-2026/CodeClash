import { AlertTriangle } from "lucide-react";
import React from "react";

import type { ConfirmationViewModel } from '../ViewModels/ConfirmationViewModel';

interface ConfirmationPopupProps {
    confirmation: ConfirmationViewModel;
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({ confirmation }) => {
    const {
        content,
        isVisible,
        handleConfirm, handleCancel,
    } = confirmation;

    if (!isVisible) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40" role="button" tabIndex={0} onMouseDown={handleCancel} 
        onKeyDown={(e) => {
            if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
                handleCancel();
            }
        }}>
            <div className="relative w-full max-w-lg rounded-3xl  text-center flex flex-col items-center gap-4 p-8 overflow-hidden bg-radial-glow" onMouseDown={(e) => e.stopPropagation()}>
                <AlertTriangle className="w-15 h-15 text-danger" strokeWidth={1.5}/>
                
                <h2 className="text-md text-primary-text font-extrabold whitespace-nowrap">{content.title}</h2>
                <p className="text-sm text-primary-text font-extrabold">{content.message}</p>

                {/*The cancel and submit buttons */}
                <div className="flex w-full gap-3">
                    <button className="btn btn-secondary w-full"
                        style = {{fontSize: 'var(--font-size-sm)'}} onClick={handleCancel} type="button">
                        {content.cancelLabel}
                    </button>

                    {/*copying above button but changing cancel to confirm */}
                    <button className="btn btn-primary w-full"
                        style = {{fontSize: 'var(--font-size-sm)'}} onClick={handleConfirm} type="button">
                        {content.confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationPopup;