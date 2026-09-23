import type React from 'react'

import { useNavigate } from 'react-router-dom'
import "../../../src/styles/global.css"

interface TournamentButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    children?: React.ReactNode
}

const TournamentButton = ({children, className, ...rest} : TournamentButtonProps) => {
    
    return(
        <button 
        className={`bg-[var(--button-tournament)] rounded-2xl shadow-[0_0_10px_var(--button-tournament)] 
        text-center items-center hover:opacity-85 hover:scale-110 transition-transform duration:300 ${className}`}
        {...rest}
        >
        {children}
        </button>
    )
}

export default TournamentButton;