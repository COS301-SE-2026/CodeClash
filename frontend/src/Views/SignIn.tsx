import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Mail, Lock} from "lucide-react";
import lightBeam from '../assets/Background/SignInBeam.png';
import planetEarth from '../assets/Planets/Earth.png';
import { SignInViewModelFunction } from "../ViewModels/SignInViewModel";

import SymbolBackground from "../assets/Background/SymbolBackground.png";
import helloRobot from "../assets/Robots/HelloRobot_Pink.png";

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
            <div className="starfield">
                {Array.from({length: 40}).map((_, i) => (
                    <span key={i} style={{top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDelay: `${Math.random() *3};s`}}/>
                ))}
            </div>

            {/*Back Button*/}
            <Link to='/' className="primary-back-button flex items-center gap-2 z-20">
                <ArrowLeft size={18}/>
                Back
            </Link>

            {/*Main Content */}
            <div className="relative z-10 flex flex-col items-center w-full max-w-md">
                {/*A glowing robot */}
                <div className="relative flex items-center justify-center -mb-10">
                    <div className="absolute w-64 h-64 rounded-full animate-glow"
                        style={{background: "radial-gradient(circle, #3d0818 0%, transparent 70%)"}}/>
                        <img src = {helloRobot} alt="" className="relative w-40 h-auto animate-float select-none pointer-events-none"/>
                </div>
                {/*Card */}
                <div className="card-glow w-full px-8 py-10 backdrop-blur-md">
                    <div className="eyebrow text-center mb-2">Welcome Back</div>
                    <h1 className="text-2xl font-black text-primary-text text-center mb-2">Continue to CodeClash</h1>
                    <p className="text-muted text-sm text-center mb-8">Compete in battles, earn badges, and rise through the ranks</p>
                    {displayError && (
                        <div className="mb-6 rounded-2xl border border-danger/30 bg-danger/10 px-5 py-4">
                            <p className="text-sm text-danger">{displayError}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SignIn;