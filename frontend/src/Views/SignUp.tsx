import React from 'react';
import ufoImage from '../assets/RedUFO.png';
import lightBeam from '../assets/SignUpBeam.png';
import { Link } from 'react-router-dom';
import { SignUpViewModelFunction } from '../ViewModels/SignUpViewModel.ts';
import type { SignUpViewModelProps } from '../ViewModels/SignUpViewModel.ts';

interface SignUpProps extends SignUpViewModelProps { };

const fieldClass = "fields w-[100%] max-w-[90vw] h-[3rem] bg-white rounded-lg px-[2%] border-[0.5px] border-primary outline-none transition-all duration-200 focus:border-pink-400 focus:shadow-[0_0_0_3px_rgba(185,21,81,0.15)] disabled:opacity-50 text-primary font-medium placeholder:text-primary/60 focus:text-primary";
const buttonPrimaryClass = "w-[100%] max-w-[90vw] h-[3rem] rounded-lg font-bold cursor-pointer flex items-center justify-center transition-all duration-200 hover:-translate-y-px active:translate-y-0 disabled:opacity-50 bg-button-primary text-button-text-primary shadow-badge";

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
    } = SignUpViewModelFunction(props);

    if (needsConfirmation) {
        return (
            <div className="relative w-full h-screen flex items-center justify-center overflow-x-hidden"
                style={{ background: 'var(--background)' }} >
                <Link className="absolute top-10 left-10 bg-primary rounded-lg px-4 py-2 heading-sub hover:opacity-80"
                    to='/welcome'
                >
                    ← Back
                </Link>

                <div className="relative z-10 flex flex-col items-center gap-4 w-[100%]" >
                    <h1 className="text-center"> {content.confirmTitle} </h1>
                    <p> {content.confirmTagline(form.email)} </p>2

                    {displayError && (
                        <p className="text-danger text-center"> {displayError} </p>
                    )}
                    {resendMessage && (
                        <p className="text-success text-center"> {resendMessage} </p>
                    )}

                    <input className={fieldClass}
                        type="text"
                        placeholder="Confirmation code"
                        value={confirmationCode}
                        onChange={(e) => setConfirmationCode(e.target.value)}
                        disabled={isLoading}
                    />

                    <button className={buttonPrimaryClass}
                        type="button"
                        onClick={handleConfirm}
                        disabled={isLoading} >
                        {isLoading ? 'Verifying..' : 'Confirm'}
                    </button>

                    <button className="heading-sub underline hover:opacity-80"
                        type="button"
                        onClick={handleResend}
                        disabled={isLoading} >
                        Resend code
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-screen flex items-center justify-center overflow-hidden"
            style={{ background: 'var(--background)' }} >
            <Link className="absolute top-10 left-10 bg-primary rounded-lg px-4 py-2 heading-sub hover:opacity-80"
                to='/welcome'
            >
                ← Back
            </Link>

            <div className="relative z-10 flex flex-col items-center" >

                {/*UFO image*/}
                <div className="relative w-full flex flex-col items-center -mt-17">
                    <img src={ufoImage} alt="UFO" className="w-[480px] h-auto object-contain z-30" />
                    <img src={lightBeam} alt="" className="absolute top-[40%] w-full h-full pointer-events-none z-10" style={{ objectFit: 'cover', transform: 'scaleX(2.5) scaleY(3)', transformOrigin: 'top center', }} />
                </div>

                <div className="relative z-20 flex flex-col items-center gap-4 w-full -mt-[12%] mb-[2%]">
                    <h1 className="heading text-center -mb-2"> {content.title} </h1>
                    <p className="heading-sub mb-2"> {content.tagline} </p>

                    {displayError && (
                        <p className="text-danger text-center"> {displayError} </p>
                    )}

                    <input className={fieldClass}
                        type="text"
                        placeholder="First name"
                        value={form.firstName}
                        onChange={(e) => setField('firstName', e.target.value)}
                        disabled={isLoading}
                    />
                    <input className={fieldClass}
                        type="text"
                        placeholder="Last name"
                        value={form.lastName}
                        onChange={(e) => setField('lastName', e.target.value)}
                        disabled={isLoading}
                    />
                    <input className={fieldClass}
                        type="text"
                        placeholder="Username"
                        value={form.username}
                        onChange={(e) => setField('username', e.target.value)}
                        disabled={isLoading}
                    />
                    <input className={fieldClass}
                        type="email"
                        placeholder="Email address"
                        value={form.email}
                        onChange={(e) => setField('email', e.target.value)}
                        disabled={isLoading}
                    />
                    <input className={fieldClass}
                        type="tel"
                        placeholder="Phone number"
                        value={form.phoneNumber}
                        onChange={(e) => setField('phoneNumber', e.target.value)}
                        disabled={isLoading}
                    />
                    <input className={fieldClass}
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) => setField('password', e.target.value)}
                        disabled={isLoading}
                    />


                    <div className="w-[500px] max-w-[90vw] flex items-center gap-3" >
                        <input className="w-8 h-8 rounded-sm cursor-pointer accent-button-primary"
                            type="checkbox"
                            id="acceptTerms"
                            checked={form.acceptedTerms}
                            onChange={(e) => setField('acceptedTerms', e.target.checked)}
                            disabled={isLoading}
                        />
                        <label className="cursor-pointer" htmlFor="acceptTerms" style={{ fontSize: 'var(--font-size-sm' }}>
                            Accept{' '}
                            <Link
                                className="underline hover:text-primary-text"
                                to='/terms'
                                target="_blank"
                            >
                                Terms &amp; Conditions
                            </Link>
                        </label>
                    </div>

                    <button className={buttonPrimaryClass}
                        type="button"
                        onClick={handleSubmit}
                        disabled={isLoading} >
                        {isLoading ? 'Signing up..' : 'Sign up'}
                    </button>
                </div>
            </div>
        </div>
    )
};

export default SignUp;