import React from 'react' 
import { Card } from "../ui/card"
import { Calculator, Hourglass, ArrowRight } from "lucide-react"
import "../../../src/styles/global.css"
import { Progress } from "./progress"
import TournamentButton from "./TournamentButton"

interface TournamentCardProps{
    children?: React.ReactNode
    className?: string
}

//Any copied and pasted code below was all hand-written and pasted for the sake of saving time, ai did not generate this code

export const MathTournamentCard = ({children, className} : TournamentCardProps) => {
    return(
        <Card className={`bg-[var(--button-tournament-secondary)] 
            border-[var(--button-tournament-secondary-border)] border-[0.5px] flex grid grid-cols-5 w-[90%] mx-auto ${className}`}>
                
                <Calculator size={90} className="ml-7 mt-4"/>

                <div className="flex grids grid-rows-2 w-full h-full">
                    <div className="font-font font-semibold text-md -ml-30">
                        Math Tournament
                    </div>
                    <div>
                        <div className="flex grid grid-cols-2 w-full">
                        <Hourglass size={30}/>
                        <div className="font-font text-xs w-full">Time Until Start:</div>
                        </div>
                    </div>
                </div>

                {/* useless div for separation: */}
                <div>
                </div>

                <div className="flex grid grid-rows-3">
                    <div className="font-font text-sm">Capacity: </div>
                    <Progress/>
                    <div className="font-font text-sm">Slots Free</div>
                </div>

                <TournamentButton>
                    <div className="flex grid grid-cols-2">
                        <h2 className="font-font font-semibold text-md mb-5 -ml-15 -mt-5">Join Tournament</h2>
                        <ArrowRight size={50}/>
                    </div>
                </TournamentButton>

            {children}
        </Card>
    )
}



