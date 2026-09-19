import type React from 'react'

import { Card } from "../ui/card"
import "../../../src/styles/global.css"

interface TournamentButtonProps{
    children?: React.ReactNode
    className?: string
}

const TournamentButton = ({children, className} : TournamentButtonProps) => {
    return(
        <Card className={`bg-[var(--button-tournament)] rounded-2xl shadow-[0_0_10px_var(--button-tournament)] ${className}`}>
        {children}
        </Card>
    )
}

export default TournamentButton;