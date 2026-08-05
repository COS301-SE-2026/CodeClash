import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, User, AtSign, Mail, Phone, Lock } from 'lucide-react';
import { SignUpViewModelFunction } from '../ViewModels/SignUpViewModel.ts';
import symbolBackground from "../assets/Background/SymbolBackground.png";

const SignUp: React.FC= () => {
    const { //this is to destructure the elements that the viewmodel returns, so that the view can access them
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
    } = SignUpViewModelFunction();

    if (needsConfirmation) {
        return (
            <div className='relativew-full min-h-screen felx items-center justify-center overflow-hidden px-6 py-16'
                style={{background: "radial-gradient(circle at 50% 12%, #b91551 0%, #850f3b 22%, #630b3c 34%, #0a0008 62%)"}}>
                <img src= {symbolBackground} alt='' className='absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none'/>

                {/*Back Btn */}
                <Link to='/' className='btn btn-ghost flex items-center fap-2 z-20'>
                    <ArrowLeft size={18}/>
                    Back
                </Link>

                {/*Content */}
                <div className='relative z-10 flex flex-col items-center backdrop-blur-md'>
                    <div className='eyebrow mb-2'>One last step</div>
                    <div className='flex justify-center mb-2'>
                        <h1 className='w-fit mx-auto text-xl font-black text-primary-text whitespace-nowrap'>Verify your email</h1>
                    </div>
                    <p className='text-muted text-xsm text-center mb-8 whitespace-nowrap'>We sent a code to{" "}
                        <span className='text-primary-text font-semibold'>{form.email}</span>
                    </p>
                    {displayError && (
                        <div className='mb-6 rounded-3xl border border-danger/30 bg-danger/10 px-5 py-4'>
                            <p className='text-sm text-danger font-semibold'>{displayError}</p>
                        </div>
                    )}
                    {resendMessage && (
                        <div className='mb-6 rounded-3xl border border-success/30 bg-success/10 px-5 py-4'>
                            <p className='text-sm text-sucess font-semibold'>{resendMessage}</p>
                        </div>
                    )}
                    <input className='input text-center tracking-[0.4rem] font-bold mb-6' type='text' placeholder='000000' value={confirmationCode} onChange={(e) => setConfirmationCode(e.target.value)} disabled={isLoading}/>
                    <button className='btn btn-primary btn-md w-full' type='button' onClick={handleConfirm} disabled={isLoading}>
                        {isLoading ? "Verifying..." : "Confirm"}
                    </button>
                    <button className='mt-5 text-sm underline text-muted-text hover:text-primary transition-colors disabled:opacity-50' type='button' onClick={handleResend} disabled={isLoading}>Resend code</button>
                </div>
            </div>
        )
    }

    {/*The main signup page */}
    return (
        <div className='relative w-full min-h-screen flex items-center justify-center overflow-hidden px-6 py-16'
            style={{background: "radial-gradient(circle at 50% 12%, #b91551 0%, #850f3b 22%, #630b3c 34%, #0a0008 62%)"}}>
            <img src={symbolBackground} alt='' className='absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none'/>
            <div className='starfield'>
                {Array.from({length: 40}).map((_, i) => (
                    <span key= {i} style={{top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDelay: `${Math.random() *3}s`}}/>
                ))}
            </div>

            {/*Back Button - copied from signin*/}
            <Link to='/' className="btn btn-ghost flex items-center gap-2 z-20">
                <ArrowLeft size={18}/>
                Back
            </Link>

            <div className='relative z-10 flex flex-col items-center w-full max-w-md'>
                <div className='relative w-full px-8 py-10 backdrop-blur-md'>
                    <div className='eyebrow text-center mb-2'>Join the arena</div>
                    <div className='flex justify-center mb-2'>
                        <h1 className='w-fit mx-auto text-xl font-black text-primary-text text-center whitespace-nowrap'>Create your account</h1>
                    </div>
                    <p className='text-muted text-xsm text-center mb-8 whitespace-nowrap'>Build your skills. Earn your rank.</p>
                </div>
            </div>
        </div>
    )
};

export default SignUp;