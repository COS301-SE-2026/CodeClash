import React from "react";
import {Link} from 'react-router-dom';
import { ForgotPasswordViewModelFunction } from "../ViewModels/ForgotPasswordViewModel";
import type { ForgotPasswordViewModelProps } from "../ViewModels/ForgotPasswordViewModel";

{/*Copying the fields and button class from SignUp.tsx */}
const fieldClass = "fields w-[100%] max-w-[90vw] h-[3rem] bg-white rounded-lg px-[2%] border-[0.5px] border-primary outline-none transition-all duration-200 focus:border-pink-400 focus:shadow-[0_0_0_3px_rgba(185,21,81,0.15)] disabled:opacity-50 text-primary font-medium placeholder:text-primary/60 focus:text-primary";
const buttonPrimaryClass = "w-[100%] max-w-[90vw] h-[3rem] text-[1.5rem] rounded-lg font-bold cursor-pointer flex items-center justify-center transition-all duration-200 hover:-translate-y-px active:translate-y-0 disabled:opacity-50 bg-button-primary text-button-text-primary shadow-badge";

const ForgotPassword: React.FC<ForgotPasswordViewModelProps> = ({onBack, onSuccess}) => {
    const {
        content, requestForm, resetForm,
        state, displayError, isLoading,
        setRequest, setReset,
        handleSendCode, handleReset,
        handleBack, handleSuccess,
    } = ForgotPasswordViewModelFunction({onBack, onSuccess});
    return (
        <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
            style={{background: 'var(--background)'}}>
            <button className="absolute top-10 left-10 bg-primary rounded-lg px-4 py-2 heading-sub hover:opacity-80"
                onClick={handleBack}>
                    ← Back
                </button>

                {/*Request for email */}
                {state === 'request' && (
                    <div className="relative z-10 flex flex-col items-center gap-4 w-full max-w-[560px]">
                        <h1 className="heading text-center">{content.titleRequest}</h1>
                        <p className="heading-sub text-center mb-4">{content.taglineRequest}</p>

                        {displayError && (
                            <p className="text-danger text-center">{displayError}</p>
                        )}

                        <input className= {fieldClass} type="email" placeholder={content.emailPlaceholder}
                            value={requestForm.email} 
                            onChange={(e) => setRequest('email', e.target.value)} disabled= {isLoading}/>

                        <button className= {buttonPrimaryClass} type="button" onClick={handleSendCode} disabled= {isLoading}>
                            {isLoading ? 'Sending...' : content.labelSendCode}
                        </button>
                    </div>
                )}
        </div>
    );
};

export default ForgotPassword;