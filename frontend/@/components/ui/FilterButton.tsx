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
        <Card className={`bg-secondary rounded-4xl flex items-center justify-center
            border-[var(--primary)] border-[0.5px] h-[12%] w-35 ${className}`}>
            {children}
        </Card>
    )
}

export default FilterButton;