import React from "react";
import {Link} from 'react-router-dom';
import { ForgotPasswordViewModelFunction } from "../ViewModels/ForgotPasswordViewModel";
import type { ForgotPasswordViewModelProps } from "../ViewModels/ForgotPasswordViewModel";

{/*Copying the fields and button class from SignUp.tsx */}
const fieldClass = "fields w-[100%] max-w-[90vw] h-[3rem] bg-white rounded-lg px-[2%] border-[0.5px] border-primary outline-none transition-all duration-200 focus:border-pink-400 focus:shadow-[0_0_0_3px_rgba(185,21,81,0.15)] disabled:opacity-50 text-primary font-medium placeholder:text-primary/60 focus:text-primary";
const buttonPrimaryClass = "w-[100%] max-w-[90vw] h-[3rem] text-[1.5rem] rounded-lg font-bold cursor-pointer flex items-center justify-center transition-all duration-200 hover:-translate-y-px active:translate-y-0 disabled:opacity-50 bg-button-primary text-button-text-primary shadow-badge";

const ForgotPassword: React.FC<ForgotPasswordViewModelProps> = ({onBack, onSuccess}) => {
    return (
        <div>

        </div>
    );
};

export default ForgotPassword;