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
            style={{background: "radial-gradient(circle at 50% 12%, #b91551 0%, #850f3b 22%, #630b3c 34%, #0a0008 62%"}}>
            
            <img src = {SymbolBackground} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none"/>
            <div className="starfield">
                {Array.from({length: 40}).map((_, i) => (
                    <span key={i} style={{top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDelay: `${Math.random() *3};s`}}/>
                ))}
            </div>
        </div>
    );
};

export default SignIn;