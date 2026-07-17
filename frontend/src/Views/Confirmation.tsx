import React from "react";
import { AlertTriangle } from "lucide-react";
import type {ConfirmationViewModel} from '../ViewModels/ConfirmationViewModel';

interface ConfirmationPopupProps {
    confirmation: ConfirmationViewModel;
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({confirmation}) => {
    const {
        content,
        isVisible, dontAskAgain, handleDontAsk,
        handleConfirm, handleCancel,
    } = confirmation;

    if (!isVisible) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40" onClick={handleCancel}>
            <div className="bg-secondary rounded-3xl p-8 w-[90%] max-w-[420px] flex flex-col items-center gap-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
                <AlertTriangle className="w-10 h-10 text-secondary-text" strokeWidth={1.5}/>
                
                <h2 className="text-secondary-text font-extrabold text-center" style = {{fontSize: 'var(--heading-size)'}}>{content.title}</h2>
                <p className="text-secondary-text text-center" style={{fontSize: 'var(--font-size-sm'}}>{content.message}</p>

                {/*Dont ask me again option */}
                <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked = {dontAskAgain} onChange={(e) => handleDontAsk(e.target.checked)}
                        className="w-5 h-5 cursor-pointer rounded"/>
                    <span className="text-secondary-text" style={{fontSize: 'var(--font-size-sm'}}>{content.dontAskAgainLabel}</span>
                </label>

                {/*The cancel and submit buttons */}
                <div className="flex w-fill gap-3">
                    <button className="flex-1 py-3 rounded-2xl bg-secondary text-secondary-text font-bold hover:opacity-80 transition-opacity"
                        style = {{fontSize: 'var(--font-size-sm'}} onClick={handleCancel}>
                        {content.cancelLabel}
                    </button>

                    {/*copying above button but changing cancel to confirm */}
                    <button className="flex-1 py-3 rounded-2xl bg-secondary text-secondary-text font-bold hover:opacity-80 transition-opacity"
                        style = {{fontSize: 'var(--font-size-sm'}} onClick={handleConfirm}>
                        {content.confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationPopup;