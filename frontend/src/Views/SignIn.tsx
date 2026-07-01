import React from "react";
import planetEarth from '../assets/Planets/Earth.png';
import lightBeam from '../assets/Background/SignInBeam.png';
import { Link } from "react-router-dom";
import { SignInViewModelFunction } from "../ViewModels/SignInViewModel";
import type { SignInViewModelProps } from "../ViewModels/SignInViewModel";

interface SignInProps extends SignInViewModelProps {};

const fieldClass = "fields w-[100%] max-w-[90vw] h-[3rem] bg-white rounded-lg px-[2%] border-[0.5px] border-primary outline-none transition-all duration-200 focus:border-pink-400 focus:shadow-[0_0_0_3px_rgba(185,21,81,0.15)] disabled:opacity-50 text-primary font-medium placeholder:text-primary/60 focus:text-primary";
const buttonPrimaryClass = "w-[100%] max-w-[90vw] h-[3rem] text-[1.5rem] rounded-lg font-bold cursor-pointer flex items-center justify-center transition-all duration-200 hover:-translate-y-px active:translate-y-0 disabled:opacity-50 bg-button-primary text-button-text-primary shadow-badge";

const SignIn: React.FC<SignInProps> = (props) => {
    const {
        content,
        form,
        displayError,
        isLoading,
        setField,
        handleSubmit,
    } = SignInViewModelFunction(props);

    return (
        <div className="relative w-full h-screen flex items-center justify-center overflow-hidden"
            style={{ background: 'var(--background)' }} >
            <Link className="absolute top-10 left-10 bg-primary rounded-lg px-4 py-2 heading-sub hover:opacity-80"
                to='/welcome'
            >
                ← Back
            </Link>

            <div className="relative z-10 flex flex-col items-center" >

                {/*Planet and Beam*/}
                <div className="relative w-full flex flex-col items-center -mt-17">
                    <img src={planetEarth} alt="UFO" className="w-[480px] h-auto object-contain z-30" />
                    <img src={lightBeam} alt="" className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ objectFit: 'cover', transform: 'scaleX(2.5) scaleY(3)', transformOrigin: 'top center', }} />
                </div>

                <div className="relative z-20 flex flex-col items-center gap-4 w-full -mt-[12%] mb-[2%]">
                    <h1 className="heading text-center -mb-2"> {content.title} </h1>
                    <p className="heading-sub mb-2"> {content.tagline} </p>

                    {displayError && (
                        <p className="text-danger text-center"> {displayError} </p>
                    )}
                </div>
            </div>
        </div>
    )
};

export default SignIn;