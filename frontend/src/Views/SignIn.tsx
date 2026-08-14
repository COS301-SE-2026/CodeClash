import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Mail, Lock} from "lucide-react";
import { SignInViewModelFunction } from "../ViewModels/SignInViewModel";

import SymbolBackground from "../assets/Background/SymbolBackground.png";
import Starfield from "@/components/ui/animations/Starfield";

const SignIn: React.FC= () => {
    const {
        form,
        displayError,
        isLoading,
        setField,
        handleSubmit,
    } = SignInViewModelFunction();

    return (
        <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden px-6 py-16" 
            style={{background: "radial-gradient(circle at 50% 12%, #b91551 0%, #850f3b 22%, #630b3c 34%, #0a0008 62%)"}}>
            
            <img src = {SymbolBackground} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none"/>
            <Starfield/>

            {/*Back Button*/}
            <Link to='/' className="btn btn-ghost primary-back-button flex items-center gap-2 z-20">
                <ArrowLeft size={18}/>
                Back
            </Link>

            {/*Main Content */}
            <div className="relative z-10 flex flex-col items-center w-full max-w-md">
                <div className="w-full px-8 backdrop-blur-md">
                    <div className="eyebrow text-center mb-2 font-extrabold">Welcome Back</div>
                    <div className="flex justify-center mb-2">
                        <h1 className="w-fit mx-auto text-xl font-black text-primary-text whitespace-nowrap">Continue to CodeClash</h1>
                    </div>
                    <p className="text-muted text-xsm text-center mb-8 whitespace-nowrap">Compete in battles, earn badges, and rise through the ranks</p>
                    {displayError && (
                        <div className="mb-6 rounded-3xl border border-danger/30 bg-danger/10 px-5 py-4">
                            <p className="text-sm text-danger font-semibold">{displayError}!</p>
                        </div>
                    )}
                    {/*FIelds */}
                    <div className="mb-5">
                        <label className="field-label">Email address</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text"/>
                            <input className="input pl-11" type="email" placeholder="email@example.com" value={form.email} onChange={(e) => setField("email", e.target.value)} disabled={isLoading}/>
                        </div>
                    </div>
                    <div>
                        <label className="field-label">Password</label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text"/>
                            <input className="input pl-11" type="password" placeholder="Enter your password" value={form.password} onChange={(e) => setField("password", e.target.value)} disabled= {isLoading}/>
                        </div>
                    </div>
                    {/*Forgot Password */}
                    <div className="flex justify-center mt-4">
                        <Link className="text-xsm underline text-muted-text hover:text-primary transition-colors" to='/forgot-password'>Forgot password?</Link>
                    </div>
                    <button className="btn btn-primary btn-lg w-full mt-6 group" type="button" onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? ("Signing in...") : (
                            <>
                                <span>Sign In</span>
                                <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1"/>
                            </>
                        )}
                    </button>
                    <div className="flex items-center gap-3 my-8">
                        <span className="divider flex-1"/>
                        <span className="text-xsm uppercase tracking-[0.2rem] text-muted-text whitespace-nowrap">New to CodeClash?</span>
                        <span className="divider flex-1"/>
                    </div>
                    <Link to='/sign-up' className="btn btn-secondary w-full group">
                        <span>Creat an account</span>
                        <ArrowRight size={18} className="transition-transform duration-300 group:hover:translate-x-1"/>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignIn;