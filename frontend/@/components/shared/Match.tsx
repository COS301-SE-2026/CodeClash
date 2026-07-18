
import BackButton from './BackButton'
import { Progress } from '../ui/progress'
import { Badge } from '../ui/badge'
import React from 'react'
import background from 'src/assets/Background/matchScreen.png'

interface MatchScreenProps {
    player_life: number[],
    colour: string,
    seconds: number,
    minutes: number,
    avatars: string[],
    usernames: string[],
}

export const MatchScreen: React.FC<MatchScreenProps> = ({
    player_life,
    colour,
    seconds,
    minutes,
    avatars,
    usernames
}) => {
    return (
        <div className="fixed inset-0 flex flex-col">
            <img src={background} className='absolute w-full -z-10'/>
            {/* <BackButton page='/dashboard' /> */}
            {/* Header */}
            <div className='flex w-full h-[20%] justify-between items-center '>
                {/* Player 1 Progress */}
                <div className="flex w-[50%] h-[60%] items-center m-2">
                    <img
                        src={avatars[0]}
                        alt="user 1 avatar"
                        className='h-[120%] flex items-center'
                    />
                    <div className=' w-[70%] flex flex-col items-start h-[70%] justify-between self-end '>
                        <Progress
                            value={player_life[0]}
                            progress_colour={colour}
                            className='w-full h-9 shadow-[0_4px_6px_rgba(0,0,0,0.3)]'
                        />
                        <Badge variant={'default'} className='text-[1.25rem] w-[50%] h-[35%]'>{usernames[0]}</Badge>
                    </div></div>
                {/* Clock */}
                <div className='text-white font-dseg w-[15%] h-20 flex items-center justify-center text-6xl font-semibold border-6 rounded-xl'>
                    <span>
                        {String(minutes).padStart(2, "0")}:
                        {String(seconds).padStart(2, "0")}
                    </span>
                </div>

                {/* Player 2 Progress */}
                <div className='flex w-[50%] h-[60%] items-center justify-end'>
                    <div className=' w-[70%] flex flex-col items-end h-[70%] justify-between self-end'>
                        <Progress
                            value={player_life[1]}
                            progress_colour={colour}
                            className='w-full h-9 shadow-[0_4px_6px_rgba(0,0,0,0.3)]'
                        />
                        <Badge variant={'secondary'} className='font-body text-[1.25rem] w-[50%] h-[35%]'>{usernames[1]}</Badge>
                    </div>

                    <img
                        src={avatars[1]}
                        alt="user 1 avatar"
                        className='scale-x-[-1] h-[120%] flex items-center '
                    />


                </div>
            </div>


            {/* Body */}
            <div>
                {/* Question box */}

                {/* Progress bar */}
            </div>
        </div>
    )
}