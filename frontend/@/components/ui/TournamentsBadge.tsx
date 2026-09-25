//Any copied and pasted code below was all hand-written and pasted for the sake of saving time, ai did not generate this code

import React from 'react' 
import "../../../src/styles/global.css"

interface TournamentsBadgeProps{
    children?: React.ReactNode
    className?: string
}

export const TournamentsBadge = ({children, className} : TournamentsBadgeProps) => {
    return(
        <div className={`bg-[var(--match-card)] border border-[0.5px] border-[var(--button-tournament-secondary-border)] rounded-[5px] text-center justify-center ${className}`}>

            {children}
        </div>
    )
}
