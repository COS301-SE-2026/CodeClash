import React from "react";
import { Link } from "react-router-dom";

import lightBeam from '../assets/Background/SignInBeam.png';
import planetEarth from '../assets/Planets/Earth.png';
import { SignInViewModelFunction } from "../ViewModels/SignInViewModel";


const fieldClass = "fields w-[100%] max-w-[90vw] h-[3rem] bg-white rounded-lg px-[2%] border-[0.5px] border-primary outline-none transition-all duration-200 focus:border-pink-400 focus:shadow-[0_0_0_3px_rgba(185,21,81,0.15)] disabled:opacity-50 text-primary font-medium placeholder:text-primary/60 focus:text-primary";
const buttonPrimaryClass = "w-[100%] max-w-[90vw] h-[3rem] text-[1.5rem] rounded-lg font-bold cursor-pointer flex items-center justify-center transition-all duration-200 hover:-translate-y-px active:translate-y-0 disabled:opacity-50 bg-button-primary text-button-text-primary shadow-badge";

const SignIn: React.FC= () => {
    const {
        form,
        displayError,
        isLoading,
        setField,
        handleSubmit,
    } = SignInViewModelFunction();

    return (
        <div className="relative w-full h-screen flex items-center justify-center overflow-hidden"
            style={{ background: 'var(--background)' }} >
            <Link className="primary-back-button"
                to='/'
            >
                ← Back
            </Link>

            <div className="relative z-10 flex flex-col items-center" >

                <div className="relative z-20 flex flex-col items-center gap-6 w-full max-w-[520px] mt-[50%] mb-[2%]">
                    <h1 className="heading text-center -mb-4"> Welcome Back, Challenger </h1>
                    <p className="heading-sub text-center mb-4"> Compete in battles, earn badges, and rise through the ranks. </p>

                    {displayError && (
                        <p className="text-danger text-center"> {displayError} </p>
                    )}

                    <input className={fieldClass}
                        type="email"
                        placeholder="Email address"
                        value={form.email}
                        onChange={(e) => setField('email', e.target.value)}
                        disabled={isLoading}
                    />

                    <input className={fieldClass}
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) => setField('password', e.target.value)}
                        disabled={isLoading}
                    />

                    <label className="cursor-pointer text-primary-text" htmlFor="acceptTerms" style={{ fontSize: 'var(--font-size-sm' }}>
                        <Link
                            className="underline text-primary-text hover:text-[#FF6299]"
                            to='/forgot-password'
                            target="_blank"
                        >
                            Forgot password?
                        </Link>
                    </label>

                    <button className={buttonPrimaryClass}
                        type="button"
                        onClick={handleSubmit}
                        disabled={isLoading} >
                        {isLoading ? 'Signing in..' : 'Sign in'}
                    </button>

                    <div className = "flex flex-col items-center gap-1">
                        <span className="text-primary-text text-sm font-heading">Are you a new user?</span>
                        <Link
                            className=" text-primary-text text-sm underline"
                            to="/sign-up"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
                
                {/*Planet and Beam*/}
                <div className="relative w-full flex flex-col items-center mt-6">
                    <img src={lightBeam} alt="" className="absolute bottom-[35%] w-full h-full pointer-events-none z-10" style={{ objectFit: 'cover', transform: 'scaleX(2.5) scaleY(4)', transformOrigin: 'bottom center', }} />
                    <img src={planetEarth} alt="UFO" className="relative w-[600px] h-auto object-contain z-30 mt-8" />
                </div>
            </div>
        </div>
    );
};

export default SignIn;