import React from 'react';

import { SignUpViewModelFunction } from '../ViewModels/SignUpViewModel.ts';
import type { SignUpViewModelProps } from '../ViewModels/SignUpViewModel.ts';

interface SignUpProps extends SignUpViewModelProps {};

const fieldClass = "w-[500px] max-w-[90vw] h-[60px] bg-white radius-lg px-5 border-[0.5px] border-primary outline-none transition-all duration-200 focus:border-pink-400 focus:shadow-[0_0_0_3px_rgba(185,21,81,0.15)] disabled:opacity-50 text-primary font-medium placeholder:text-primary/60 focus:text-primary";
const buttonPrimaryClass = "w-[500px] max-w-[90vw] h-[60px] radius-lg font-bold cursor-pointer flex items-center justify-center transition-all duration-200 hover:-translate-y-px active:translate-y-0 disabled:opacity-50 bg-button-primary text-button-text-primary shadow-badge";

const SignUp: React.FC<SignUpProps> = (props) => {
    const { //this is to destructure the elements that the viewmodel returns, so that the view can access them
        content,
        form,
        confirmationCode,
        needsConfirmation,
        displayError,
        resendMessage,
        isLoading,
        setField,
        setConfirmationCode,
        handleSubmit,
        handleConfirm,
        handleResend,
        handleBack,
        handleSignIn,
        handleConfirmBack,
    } = SignUpViewModelFunction(props);

    if (needsConfirmation) {
        return (
            <div className= "relative w-full min-h-screen flex items-center justify-center overflow-hidden"
                style= {{background: 'var(--background)'}} >
                <button className= "absolute top-10 left-10 bg-primary radius-lg px-4 py-2 heading-sub hover:opacity-80"
                    onClick={handleConfirmBack}
                    type="button" >
                    ← Back
                </button>

                <div className= "relative z-10 flex flex-col items-center gap-4 w-full max-w-[560px]" >
                    <h1 className= "heading-big text-center"> {content.confirmTitle} </h1>
                    <p> {content.confirmTagline(form.email)} </p>2

                    {displayError && (
                        <p className= "text-danger text-center"> {displayError} </p>
                    )}
                    {resendMessage && (
                        <p className= "text-success text-center"> {resendMessage} </p>
                    )}
                </div>
            </div>
        );
    }

};

export default SignUp;