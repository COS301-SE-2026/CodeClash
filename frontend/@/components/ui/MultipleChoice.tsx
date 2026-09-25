//the following code was copied and pasted from another file and then changed
// to save time - it was originally hand-written and all edits to it were hand-written

import React from 'react'

import "../../../src/styles/global.css"
import { MatchCard } from './MatchCard'
import {Check} from "lucide-react"


interface MultipleChoiceProps{
    children?: React.ReactNode;
    className?: string;
    letter?: string;
    option?: string;
    selected?: boolean;
}

export const MultipleChoice = ({children, className, letter, option, selected} : MultipleChoiceProps) => {

    return(
        <MatchCard className={`bg-[var(--multiple-choice-box)] flex flex-row w-auto overflow-x-auto gap-1 
        min-w-[10%] ${selected ? 'bg-primary/20 border-primary shadow-[0_0_7px_var(--primary)]': ""} ${className}`}>
            
            <div className={`bg-[var(--multiple-choice-letter)] border-[0.5px] my-auto sm:min-w-0 
                border-[var(--button-tournament-secondary-border)] rounded-[10px] ml-2 w-10 h-10 text-center
                ${selected ? "bg-primary border-primary shadow-[0_0_7px_var(--primary)]" : ""}`}
            >
                <h1 className="text-secondary text-[15px] my-auto mt-1.75">{letter}</h1> 
            </div>

            <h1 className="font-semibold text-sm ml-3 mt-1">{option}</h1>

            <MatchCard className={`p-0 flex rounded-full ml-auto h-6 w-6 bg-[var(--multiple-choice-box)] 
                border-[var(--button-tournament-secondary-border)] mr-3 my-auto items-center justify-center
                ${selected ? "bg-primary border-primary shadow-[0_0_7px_var(--primary)]" : ""}`}>
                  {selected ? <Check className="text-secondary"/> : "" }      
            </MatchCard>
            {children}
        </MatchCard>
    )
}