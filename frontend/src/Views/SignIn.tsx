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

    );
};

export default SignIn;