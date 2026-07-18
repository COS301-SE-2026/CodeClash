
import BackButton from './BackButton'
import {Progress} from '../ui/progress'
import React from 'react'

interface MatchScreenProps {
    player_life: number[],
    colour: string,
}

export const MatchScreen: React.FC<MatchScreenProps> = ({
    player_life,
    colour,
}) => {
    return (
        <div className="fixed inset-0 flex flex-col">
            <BackButton page='/dashboard'/>
            {/* Header */}
            <div className='flex w-full h-[20%] justify-between items-center'>

                {/* Player 1 Progress */}
                <Progress
                    value= {player_life[0]}
                    progress_colour={colour}
                    className='w-full h-7 shadow-[0_4px_6px_rgba(0,0,0,0.3)]'
                />  
                           
            </div>


            {/* Body */}
            <div>
                {/* Question box */}

                {/* Progress bar */}
            </div>
        </div>
    )
}