import type React from 'react'

import { useNavigate } from 'react-router-dom'
import "../../../src/styles/global.css"

interface TournamentButtonProps{
    children?: React.ReactNode
    className?: string
}

const TournamentButton = ({children, className} : TournamentButtonProps) => {

    const nav = useNavigate();
    
    return(
        <div onClick={() => nav('/tournaments/waiting')} 
        className={`bg-[var(--button-tournament)] rounded-2xl shadow-[0_0_10px_var(--button-tournament)] text-center items-center hover:opacity-85 hover:scale-110 transition-transform duration:300 ${className}`}>
        {children}
        </div>
    )
}

export default TournamentButton;