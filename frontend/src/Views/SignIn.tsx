import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, LogIn, Mail, Lock} from "lucide-react";
import lightBeam from '../assets/Background/SignInBeam.png';
import planetEarth from '../assets/Planets/Earth.png';
import { SignInViewModelFunction } from "../ViewModels/SignInViewModel";

const SignIn: React.FC= () => {
    const {
        form,
        displayError,
        isLoading,
        setField,
        handleSubmit,
    } = SignInViewModelFunction();

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-12"
            style={{ background: 'var(--background)' }} >

            {/*Moving the beam and planet */}
            <img src={lightBeam} alt="" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] opacity-30 pointer-events-none"/>
            <img src={planetEarth} alt="" className="absolute bottom-[-120px] right-[-100px] w-[520px] opacity-60 pointer-events-none select-none"/>

            <Link className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-primary-text text-sm font-medium transition-all duration-200 hover:bg-white/10 hover:border-white/20 hover:-translate-x-1 hover:shadow-lg"
                to='/' 
            >
                <ArrowLeft size={25}/> 
                <span>Back</span>
            </Link>

            <div className="relative z-10 w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl px-8 py-8" >
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-button-primary/20 flex items-center justify-center mb-5">
                        <LogIn size={30} className="text-button-primary"/>
                    </div>
                    <h1 className="heading !text-4xl mb-3"> Welcome Back</h1>
                    <p className="text-primary-text/70 text-base leading-relaxed max-w-sm"> Continue your CodeClash journey - compete in battles, earn badges, and rise through the ranks. </p>
                </div>

                {displayError && (
                    <div className="mb-6 px-4 py-3 text-xsm text-danger"> {displayError}! </div>
                )}

                <div className="relative mb-5">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50"/>
                    <input className={fieldClass}
                        type="email"
                        placeholder="Email address"
                        value={form.email}
                        onChange={(e) => setField('email', e.target.value)}
                        disabled={isLoading}
                    />
                </div>

                <div className="relative mb-4">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50"/>
                    <input className={fieldClass}
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) => setField('password', e.target.value)}
                        disabled={isLoading}
                    />
                </div>

                <div className="flex justify-center mb-7">
                    <Link
                        className="text-xsm underline text-primary-text/75 hover:text-button-primary transition-colors"
                        to='/forgot-password'
                    >
                        Forgot password?
                    </Link>
                </div>

                <button className={buttonPrimaryClass}
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading} >
                    {isLoading ? ("Signing in...") : (
                        <>
                            Sign in
                            <ArrowRight size={25}/>
                        </>
                    )}
                </button>

                <div className="text-center gap-3 my-8">
                    <p className="text-primary-text/70 text-sm mb-2">New to CodeClash?</p>
                    <Link
                        className="inline-flex items-center gap-2 font-semibold text-button-primary hover:gap-3 transition-all"
                        to="/sign-up"
                    >
                        Create an account
                        <ArrowRight size={25}/>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignIn;