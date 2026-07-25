import React from "react";
import { ForgotPasswordViewModelFunction } from "../ViewModels/ForgotPasswordViewModel";
import type { ForgotPasswordViewModelProps } from "../ViewModels/ForgotPasswordViewModel";
import { CheckCircle } from "lucide-react";

//Copying the fields and button class from SignUp.tsx
const fieldClass = "fields w-[100%] max-w-[90vw] h-[3rem] bg-white rounded-lg px-[2%] border-[0.5px] border-primary outline-none transition-all duration-200 focus:border-pink-400 focus:shadow-[0_0_0_3px_rgba(185,21,81,0.15)] disabled:opacity-50 text-primary font-medium placeholder:text-primary/60 focus:text-primary";
const buttonPrimaryClass = "w-[100%] max-w-[90vw] h-[3rem] text-[1.5rem] rounded-lg font-bold cursor-pointer flex items-center justify-center transition-all duration-200 hover:-translate-y-px active:translate-y-0 disabled:opacity-50 bg-button-primary text-button-text-primary shadow-badge";

const ForgotPassword: React.FC<ForgotPasswordViewModelProps> = ({onBack, onSuccess}) => {
    const {
        content, requestForm, resetForm,
        state, displayError, isLoading,
        setRequest, setReset,
        handleSendCode, handleReset,
        handleBack,
    } = ForgotPasswordViewModelFunction({onBack, onSuccess});
    return (
        <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
            style={{background: 'var(--background)'}}>
            <button className="absolute top-10 left-10 bg-primary rounded-lg px-4 py-2 heading-sub hover:opacity-80"
                onClick={handleBack} type="button">
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

                {state === 'reset' && (
                    <div className="relative z-10 flex flex-col items-center gap-4 w-full max-w-[560px]">
                        <h1 className= "heading text-center">{content.titleReset}</h1>
                        <p className="heading-sub text-center mb-4">{content.taglineReset(requestForm.email)}</p>

                        {displayError && (
                            <p className="text-danger text-center">{displayError}</p>
                        )}

                        <input className= {fieldClass} type="text" placeholder= {content.codePlaceholder}
                            value={resetForm.code} onChange={(e) => setReset('code', e.target.value)} disabled= {isLoading}/>
                        {/*Copying above for next 2 and changing as needed */}
                        <input className= {fieldClass} type="password" placeholder= {content.newPasswordPlaceholder}
                            value={resetForm.newPassword} onChange={(e) => setReset('newPassword', e.target.value)} disabled= {isLoading}/>
                        <input className= {fieldClass} type="password" placeholder= {content.confirmPasswordPlaceholder}
                            value={resetForm.confirmPassword} onChange={(e) => setReset('confirmPassword', e.target.value)} disabled= {isLoading}/>

                        {/*Copying the button from request above */}
                        <button className= {buttonPrimaryClass} type="button" onClick={handleReset} disabled= {isLoading}>
                            {isLoading ? 'Confirming...' : content.labelConfirm}
                        </button>
                    </div>
                )}

                {state === 'success' && (
                    <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-[560px]">
                        <CheckCircle className="w-16 h-16 text-success text-center"/>
                        <h1 className="heading text-center">{content.titleReset}</h1>
                        <p className="heading-sub text-center">{content.messageSuccess}</p>

                        <button className= {buttonPrimaryClass} type = "button" onClick={onSuccess}>Back to Sign in</button>
                    </div>
                )}
        </div>
    );
};

export default ForgotPassword;