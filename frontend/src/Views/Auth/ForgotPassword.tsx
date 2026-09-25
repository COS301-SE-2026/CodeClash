import { CheckCircle, ArrowLeft , Mail} from "lucide-react";
import React from "react";
import { useNavigate, Link } from "react-router-dom";

import { ForgotPasswordViewModelFunction } from "../../ViewModels/ForgotPasswordViewModel";

const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const {
        content, requestForm, resetForm,
        state, displayError, isLoading,
        setRequest, setReset,
        handleSendCode, handleReset,
    } = ForgotPasswordViewModelFunction();
    return (
        <div className="relative bg-background w-full min-h-screen flex items-center justify-center overflow-hidden">
            {/*Back Button*/}
            <Link to='/sign-in' className="btn btn-ghost primary-back-button flex items-center gap-2 z-20">
                <ArrowLeft size={18}/>
                Back
            </Link>

                {/*Request for email */}
                {state === 'request' && (
                    <div className="relative z-10 flex flex-col items-center gap-4 w-full max-w-[560px]">
                        <h1 className="text-l text-center">{content.titleRequest}</h1>
                        <p className="text-sm text-center mb-4 whitespace-nowrap">{content.taglineRequest}</p>

                        {displayError && (
                            <p className="text-primary-text text-center">{displayError}</p>
                        )}

                        <div className='relative w-full'>
                            <Mail size={16} className='absolute left-4 top-1/2 -translate-y-1/2 text-muted-text'/>
                            <input className= 'input pl-10' type="email" placeholder={content.emailPlaceholder}
                                value={requestForm.email} 
                                onChange={(e) => setRequest('email', e.target.value)} disabled= {isLoading}/>
                        </div>

                        <button className= 'btn btn-primary w-full' type="button" onClick={handleSendCode} disabled= {isLoading}>
                            {isLoading ? 'Sending...' : content.labelSendCode}
                        </button>
                    </div>
                )}

                {state === 'reset' && (
                    <div className="relative z-10 flex flex-col items-center gap-4 w-full max-w-[560px]">
                        <h1 className= "text-l text-center">{content.titleReset}</h1>
                        <p className="text-sm text-center mb-4 whitespace-nowrap">{content.taglineReset(requestForm.email)}</p>

                        {displayError && (
                            <p className="text-primary-text text-center">{displayError}</p>
                        )}

                        <input className= 'input' type="text" placeholder= {content.codePlaceholder} //This is the input field for the code
                            value={resetForm.code} onChange={(e) => setReset('code', e.target.value)} disabled= {isLoading}/>
                        {/*Copying above for next 2 and changing as needed */}
                        <input className= 'input' type="password" placeholder= {content.newPasswordPlaceholder}
                            value={resetForm.newPassword} onChange={(e) => setReset('newPassword', e.target.value)} disabled= {isLoading}/>
                        <input className= 'input' type="password" placeholder= {content.confirmPasswordPlaceholder}
                            value={resetForm.confirmPassword} onChange={(e) => setReset('confirmPassword', e.target.value)} disabled= {isLoading}/>

                        {/*Copying the button from request above */}
                        <button className= 'btn btn-primary w-full' type="button" onClick={handleReset} disabled= {isLoading}>
                            {isLoading ? 'Confirming...' : content.labelConfirm}
                        </button>
                    </div>
                )}

                {state === 'success' && (
                    <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-[560px]">
                        <CheckCircle className="w-16 h-16 text-success text-center"/>
                        <h1 className="text-l text-center">{content.titleReset}</h1>
                        <p className="text-sm text-center whitespace-nowrap">{content.messageSuccess}</p>

                        <button className= 'btn btn-primary w-full' type = "button" onClick={() => navigate('/sign-in')}>Back to Sign in</button>
                    </div>
                )}
        </div>
    );
};

export default ForgotPassword;