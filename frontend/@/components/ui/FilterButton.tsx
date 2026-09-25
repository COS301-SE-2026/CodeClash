//All code below was hand-written and copied and pasted then changed for the sake of saving time, none of it was ai-generated
import React from 'react' 
import "../../../src/styles/global.css"

interface FilterButtonProps{
    children?: React.ReactNode
    className?: string
}


const FilterButton = ({children, className} : FilterButtonProps) => {
    return(
        <div className={`bg-secondary rounded-4xl flex text-center items-center justify-center text-primary font-semibold
            border-[var(--primary)] border-[0.5px] hover:opacity-80 hover:scale-110 transition-transform duration-300 ${className}`}>
            {children}
        </div>
    )
}

export default FilterButton;