//All code below was hand-written and copied and pasted then changed for the sake of saving time, none of it was ai-generated
import React from 'react' 
import { Card } from "../ui/card"
import "../../../src/styles/global.css"

interface FilterButtonProps{
    children?: React.ReactNode
    className?: string
}


const FilterButton = ({children, className} : FilterButtonProps) => {
    return(
        <Card className={`bg-[var(--button-tournament-secondary)] 
            border-[var(--button-tournament-secondary-border)] border-[0.5px] rounded-lg shadow-[0_0_10px_var(--button-tournament-secondary-border)] h-[20%] w-[40%] font-font font-semibold text-center ${className}`}>
            {children}
        </Card>
    )
}

export default FilterButton;