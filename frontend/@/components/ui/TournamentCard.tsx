import React from 'react' 
import { Card } from "../ui/card"
import { Calculator, Timer, ArrowRight } from "lucide-react"
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
        <Card className={`bg-card 
            border-[var(--button-tournament-secondary)] border-[0.5px] flex grid grid-cols-5 w-400 mx-auto ${className}`}>
                
                <Calculator size={90} className="ml-9 my-auto"/>

                <div className="grid grid-rows-2 max-w-full h-full mt-2">
                    <div className="font-font font-semibold text-xl -ml-30">
                        Math Tournament
                    </div>
                    
                    <div className="grid grid-cols-2 -ml-30">
                        <Timer size={40} className="text-muted-text mt-1"/>
                        <div className="font-font text-sm justify-self-start -ml-[75%] mt-3 text-primary">Time Until Start:</div>
                    </div>
                    
                </div>

                {/* useless div for separation: */}
                <div>
                </div>

                <div className="-ml-40 flex grid grid-rows-2 mt-1">
                    <div className="grid grid-cols-2">
                    <div className="font-font text-sm mt-7 text-primary">Capacity: </div>
                    <div className="font-font text-sm mt-7 -ml-9 text-primary">5/8 Players</div>
                    </div>
                    <Progress value={62.5} className="mt-3 w-[65%]"/>
                </div>

                <TournamentButton className="mx-auto h-[50%] w-85 my-auto -ml-20">
                    <div className="flex grid grid-cols-2 w-full h-full">
                        <h2 className="font-font font-semibold text-[30px] w-[150%] ml-6 -mt-2">Join Tournament</h2>
                        <ArrowRight size={50} className="flex justify-self-end my-auto -mt-3 -ml-8 mr-3"/>
                    </div>
                </TournamentButton>

            {children}
        </Card>
    )
}



