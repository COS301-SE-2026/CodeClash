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
                
                <Calculator size={90} className="ml-7 my-auto"/>

                <div className="grid grid-rows-2 w-full h-full mt-3">
                    <div className="font-font font-semibold text-xl -ml-30">
                        Math Tournament
                    </div>
                    
                    <div className="flex grid grid-cols-2 w-full -ml-30">
                        <Hourglass size={50}/>
                        <div className="font-font text-sm w-full -ml-25">Time Until Start:</div>
                    </div>
                    
                </div>

                {/* useless div for separation: */}
                <div>
                </div>

                <div className="-ml-20 flex grid grid-rows-3">
                    <div className="font-font text-md mt-3">Capacity: </div>
                    <Progress className="mt-2"/>
                    <div className="font-font text-md">Slots Free</div>
                </div>

                <TournamentButton className="mx-auto h-[50%]">
                    <div className="flex grid grid-cols-2">
                        <h2 className="font-font font-semibold text-md mb-5 -ml-15 -mt-5">Join Tournament</h2>
                        <ArrowRight size={50}/>
                    </div>
                </TournamentButton>

            {children}
        </Card>
    )
}



