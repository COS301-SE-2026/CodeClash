import type React from 'react'

import { useNavigate } from 'react-router-dom'
import "../../../src/styles/global.css"

interface TournamentButtonProps{
    children?: React.ReactNode
    className?: string
}

const TournamentButton = ({children, className} : TournamentButtonProps) => {
    return(
        <div className={`bg-[var(--button-tournament)] rounded-2xl shadow-[0_0_10px_var(--button-tournament)] text-center items-center ${className}`}>
        {children}
        </div>
    )
}

export default TournamentButton;