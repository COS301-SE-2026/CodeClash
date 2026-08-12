import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, User, AtSign, Mail, Phone, Lock } from 'lucide-react';
import { SignUpViewModelFunction } from '../ViewModels/SignUpViewModel.ts';
import symbolBackground from "../assets/Background/SymbolBackground.png";
import Starfield from '@/components/ui/Starfield.tsx';

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
            <div className='relativew-full min-h-screen flex items-center justify-center overflow-hidden px-6 py-16'
                style={{background: "radial-gradient(circle at 50% 12%, #b91551 0%, #850f3b 22%, #630b3c 34%, #0a0008 62%)"}}>
                <img src= {symbolBackground} alt='' className='absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none'/>

                {/*Back Btn */}
                <Link to='/' className='btn btn-ghost primary-back-button flex items-center gap-2 z-20'>
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
            <Starfield/>

            {/*Back Button - copied from signin*/}
            <Link to='/' className="btn btn-ghost primary-back-button flex items-center gap-2 z-20">
                <ArrowLeft size={18}/>
                Back
            </Link>

            <div className='relative z-10 flex flex-col items-center w-full max-w-md'>
                <div className='relative w-full px-8 backdrop-blur-md'>
                    <div className='eyebrow text-center mb-2'>Join the arena</div>
                    <div className='flex justify-center mb-2'>
                        <h1 className='w-fit mx-auto text-xl font-black text-primary-text text-center whitespace-nowrap'>Create your account</h1>
                    </div>
                    <p className='text-muted text-xsm text-center mb-8 whitespace-nowrap'>Build your skills. Earn your rank.</p>
                    {displayError && (
                        <div className='mb-6 rounded-3xl border border-danger/30 bg-danger/10 px-5 py-4'>
                            <p className='text-sm text-danger'>{displayError}!</p>
                        </div>
                    )}
                    {/*Fields */}
                    <div className='grid grid-cols-2 gap-4 mb-4'>
                        <div>
                            <label className='field-label'>First Name</label>
                            <div className='relative'>
                                <User size={16} className='absolute left-4 top-1/2 -translate-y-1/2 text-muted-text'/>
                                <input className='input pl-10' type='text' placeholder='John' value={form.firstName} onChange={(e) => setField('firstName', e.target.value)} disabled={isLoading}/>
                            </div>
                        </div>
                        {/*Copying above field and changing what needs to be changed */}
                        <div>
                            <label className='field-label'>Last Name</label>
                            <div className='relative'>
                                <User size={16} className='absolute left-4 top-1/2 -translate-y-1/2 text-muted-text'/>
                                <input className='input pl-10' type='text' placeholder='Doe' value={form.lastName} onChange={(e) => setField('lastName', e.target.value)} disabled={isLoading}/>
                            </div>
                        </div>
                    </div>
                    <div className='mb-4'>
                        <label className='field-label'>Username</label>
                        <div className='relative'>
                            <AtSign size={16} className='absolute left-4 top-1/2 -translate-y-1/2 text-muted-text'/>
                            <input className='input pl-10' type='text' placeholder='JohnDoe' value={form.username} onChange={(e) => setField('username', e.target.value)} disabled={isLoading}/>
                        </div>
                    </div>
                    {/*Copying above field and changing what needs to be */}
                    <div className='mb-4'>
                        <label className='field-label'>Email address</label>
                        <div className='relative'>
                            <Mail size={16} className='absolute left-4 top-1/2 -translate-y-1/2 text-muted-text'/>
                            <input className='input pl-10' type='email' placeholder='email@example.com' value={form.email} onChange={(e) => setField('email', e.target.value)} disabled={isLoading}/>
                        </div>
                    </div>
                    <div className='mb-4'>
                        <label className='field-label'>Phone number</label>
                        <div className='relative'>
                            <Phone size={16} className='absolute left-4 top-1/2 -translate-y-1/2 text-muted-text'/>
                            <input className='input pl-10' type='tel' placeholder='+27 12 345 6789' value={form.phoneNumber} onChange={(e) => setField('phoneNumber', e.target.value)} disabled={isLoading}/>
                        </div>
                    </div>
                    <div className='mb-4'>
                        <label className='field-label'>Password</label>
                        <div className='relative'>
                            <Lock size={16} className='absolute left-4 top-1/2 -translate-y-1/2 text-muted-text'/>
                            <input className='input pl-10' type='password' placeholder='Create a password' value={form.password} onChange={(e) => setField('password', e.target.value)} disabled={isLoading}/>
                        </div>
                    </div>
                    {/*Terms and Conditions */}
                    <div className='flex items-center gap-3 mb-8'>
                        <input className='w-5 h-5 rounded-sm cursor-pointer accent-primary shrink-0' type='checkbox' id='acceptTerms' checked={form.acceptedTerms} onChange={(e) => setField('acceptedTerms', e.target.checked)} disabled={isLoading}/>
                        <label className='cursor-pointer text-xsm text-muted-text' htmlFor='acceptTerms'>
                            Accept{' '}
                            <Link className='underline text-muted-text hover:text-primary transition-colors text-xsm' to='/terms' target='_blank'>Terms &amp; Conditions</Link>
                        </label>
                    </div>
                    <button className='btn btn-primary btn-md w-full group' type='button' onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? ("Signing up...") : (
                            <>
                                <span>Sign Up</span>
                                <ArrowRight size={20} className='transition-transform duration-300 group-hover:translate-x-1'/>
                            </>
                        )}
                    </button>
                    {/*Copied from Signin */}
                    <div className="flex items-center gap-3 my-8">
                        <span className="divider flex-1"/>
                        <span className="text-xsm uppercase tracking-[0.2rem] text-muted-text whitespace-nowrap">Have an account?</span>
                        <span className="divider flex-1"/>
                    </div>
                    <Link to='/sign-in' className="btn btn-secondary w-full group">
                        <span>Continue to CodeClash</span>
                        <ArrowRight size={18} className="transition-transform duration-300 group:hover:translate-x-1"/>
                    </Link>
                </div>
            </div>
        </div>
    )
};

export default SignUp;