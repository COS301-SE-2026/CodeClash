import '../styles/global.css'
import React from 'react'
import {useNavigate} from 'react-router-dom'

export function Popup(){

    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full bg-sky-50 flex items-center justify-center p-6">

        <div className="relative w-full max-w-sm">

        <img src="/robot.png" alt="robot" className="absolute -top-28 left-1/2 -translate-x-1/2 w-44 z-10"></img>

    

        </div>


        </div>
    );
}

