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
        <button onClick={() => nav('/tournaments/waiting')} className={`bg-[var(--button-tournament)] rounded-2xl shadow-[0_0_10px_var(--button-tournament)] ${className}`}>
        {children}
        </button>
    )
}

export default TournamentButton;