import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, LogIn, Mail, Lock} from "lucide-react";
import lightBeam from '../assets/Background/SignInBeam.png';
import planetEarth from '../assets/Planets/Earth.png';
import { SignInViewModelFunction } from "../ViewModels/SignInViewModel";


const fieldClass = "w-full h-12 rounded-xl border border-white/10 bg-white/90 pl-12 pr-4 text-sm text-primary placeholder:text-primary/50 outline-none transition-all duration-200 focus:border-button-primary focus:ring-4 focus:ring-pink-200";
const buttonPrimaryClass = "w-full h-12 rounded-xl bg-button-primary text-button-text-primary font-semibold items-center justify-center gap-2 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:opacity-50";

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
            <img src={planetEarth} alt="" className="absolute -bottom-24 right-[-60px] w-[420px] opacity-90 pointer-events-none none-selected"/>

            <Link className="primary-back-button flex items-center gap-2"
                to='/' 
            >
                <ArrowLeft size={25}/> Back
            </Link>

            <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl px-8 py-10" >
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-button-primary/20 flex items-center justify-center mb-5">
                        <LogIn size={30} className="text-button-primary"/>
                    </div>
                    <h1 className="heading !text-4xl mb-3"> Welcome Back</h1>
                    <p className="text-primary-text/70 text-base leading-relaxed max-w-sm"> Continue your CodeClash journey - compete in battles, earn badges, and rise through the ranks. </p>
                </div>

                {displayError && (
                    <div className="mb-6 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-danger"> {displayError} </div>
                )}

                <div className="relative-mb-5">
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
        </div>
    );
};

export default SignIn;