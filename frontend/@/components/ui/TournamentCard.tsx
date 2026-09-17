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
            border-[var(--button-tournament-secondary-border)] border-[0.5px] flex grid grid-cols-5 w-[95%] mx-auto ${className}`}>
                
                <Calculator size={90} className="ml-9 my-auto"/>

                <div className="grid grid-rows-2 w-full h-full mt-2">
                    <div className="font-font font-semibold text-xl -ml-30">
                        Math Tournament
                    </div>
                    
                    <div className="grid grid-cols-2 -ml-30">
                        <Hourglass size={50}/>
                        <div className="font-font text-md justify-self-start -ml-[77%] mt-1">Time Until Start:</div>
                    </div>
                    
                </div>

                {/* useless div for separation: */}
                <div>
                </div>

                <div className="-ml-40 flex grid grid-rows-2 mt-1">
                    <div className="grid grid-cols-2">
                    <div className="font-font text-md mt-5">Capacity: </div>
                    <div className="font-font text-sm mt-7 -ml-9">5/8 Players</div>
                    </div>
                    <Progress className="mt-3 w-[65%]"/>
                </div>

                <TournamentButton className="mx-auto h-[50%] w-[100%] my-auto -ml-17">
                    <div className="flex grid grid-cols-2 w-full h-full">
                        <h2 className="font-font font-semibold text-[30px] w-[130%] ml-6 -mt-2">Join Tournament</h2>
                        <ArrowRight size={50} className="flex justify-self-end my-auto -mt-3 -ml-8 mr-3"/>
                    </div>
                </TournamentButton>

            {children}
        </Card>
    )
}



