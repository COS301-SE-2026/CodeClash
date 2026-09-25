//the following code was copied and pasted from another file and then changed
// to save time - it was originally hand-written and all edits to it were hand-written

import React from 'react'

import "../../../src/styles/global.css"
import { MatchCard } from './MatchCard'


interface MultipleChoiceProps{
    children?: React.ReactNode;
    className?: string;
    letter?: string;
    option?: string;
}

export const MultipleChoice = ({children, className, letter, option} : MultipleChoiceProps) => {

    return(
        <MatchCard className={`bg-[var(--multiple-choice-box)] flex flex-row w-auto overflow-x-auto gap-1 min-w-[10%] ${className}`}>
            
            <div className="bg-[var(--multiple-choice-letter)] border-[0.5px] my-auto sm:min-w-0 
                border-[var(--button-tournament-secondary-border)] rounded-[10px] ml-2 w-10 h-10 text-center"
            >
                <h1 className="text-secondary text-[15px] my-auto mt-1.75">{letter}</h1> 
            </div>
            <h1 className="font-semibold text-sm ml-3 mt-1">{option}</h1>
            {children}
        </MatchCard>
    )
}