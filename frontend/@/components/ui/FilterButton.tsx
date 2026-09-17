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
        <Card className={`bg-secondary rounded-lg flex justify-between items-center px-3 py-2 mb-1
            border-[var(--primary)] border-[0.5px] shadow-[0_0_10px_var(--primary)] h-[20%] w-[40%] text-secondary-text font-semibold text-xsm ${className}`}>
            {children}
        </Card>
    )
}

export default FilterButton;