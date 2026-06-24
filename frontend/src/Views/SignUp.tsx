import React from 'react';
import { SignUpViewModelFunction } from '../ViewModels/SignUpViewModel.ts';
import { SignUpRoutes } from '../Models/SignUpModel.ts';
import type { SignUpViewModelProps } from '../ViewModels/SignUpViewModel.ts';

interface SignUpProps extends SignUpViewModelProps {};

const fieldClass = "w-[500px] max-w-[90vw] h-[60px] bg-white radius-lg px-5 border-[0.5px] border-primary outline-none transition-all duration-200 focus:border-pink-400 focus:shadow-[0_0_0_3px_rgba(185,21,81,0.15)] disabled:opacity-50 text-primary font-medium placeholder:text-primary/60 focus:text-primary";
const buttonPrimaryClass = "w-[500px] max-w-[90vw] h-[60px] radius-lg font-bold cursor-pointer flex items-center justify-center transition-all duration-200 hover:-translate-y-px active:translate-y-0 disabled:opacity-50 bg-button-primary text-button-text-primary shadow-badge";
