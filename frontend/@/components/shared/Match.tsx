import React from 'react'
import background from 'src/assets/Background/matchScreen.png'
import door from 'src/assets/Decor/door.png'

import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { UseUserPose } from 'src/Views/Profile'


interface MatchScreenProps {
    player_life: number[],
    colour: string,
    seconds: number,
    minutes: number,
    avatars: string[],
    usernames: string[],
    children: React.ReactNode,
    question_number: number,
    current_question: number,
    opponent_progress: number,
    question_results: (boolean | null)[],
    opponent_done: boolean,
}

export const MatchScreen: React.FC<MatchScreenProps> = ({
    player_life,
    colour,
    seconds,
    minutes,
    avatars,
    usernames,
    children,
    question_number,
    current_question,
    opponent_progress,
    question_results,
    opponent_done
}) => {


    return (
        <div className="fixed inset-0 flex flex-col">
            <img src={background} className='absolute w-full -z-10' alt='background' />
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
                    
                    <div className='w-[70%] flex flex-col items-start h-[70%] justify-between self-end'>
                        <Progress
                            value={player_life[0]}
                            progress_colour={colour}
                            className='w-full h-9 shadow-[0_4px_6px_rgba(0,0,0,0.3)]'
                        />
                        <Badge variant={'default'} className='text-[1.25rem] w-[50%] h-[35%]'>{usernames[0]}</Badge>
                    </div></div>
                {/* Clock */}
                <div className='text-white font-dseg w-[15%] h-20 flex items-center justify-center text-5xl font-semibold border-6 rounded-l'>
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
                            className='w-full h-9 shadow-[0_4px_6px_rgba(0,0,0,0.3)] scale-x-[-1]'
                        />
                        <Badge variant={'secondary'} className='text-[1.25rem] w-[50%] h-[25%]'>{usernames[1]}</Badge>
                    </div>

                    <img
                        src={avatars[1]}
                        alt="user 1 avatar"
                        className='scale-x-[-1] h-[120%] flex items-center '
                    />
                </div>
            </div>


            {/* Body */}
            <div className='flex justify-evenly'>
                <div className='flex flex-col w-[70%] h-[40rem]'>
                    <div className='absolute bg-gradient-to-r from-button-primary to-secondary h-[3%] w-[71%] rounded-4xl shadow-[0_4px_6px_rgba(0,0,0,0.3)]'></div>
                    {/* Question box */}

                    <div className='bg-secondary w-[100%] h-[100%] rounded-4xl ml-1 pt-[2rem] flex flex-col justify-between itmes-center'>
                        {children}
                    </div>
                </div>

                {/* Progress bar */}
                <div className='flex flex-col items-center w-[20%] justify-between'>

                    {/* progress  */}
                    <div className='w-[100%] flex'>


                        <div className='grid grid-cols-2 w-[100%]'>

                            {/* avatars */}
                            <div className='relative flex flex-row'>
                                <img src={avatars[0]}
                                    className=" absolute w-20 h-30 object-cover left-20"
                                    style={{ top: `${(question_number - 1 - current_question) * 9.6}rem` }}
                                    alt='progress avatar user 1'
                                />
                                <div className='relative w-[50%]'>
                                    <img src={avatars[0]}
                                        className=" absolute w-20 h-30 object-cover scale-x-[-1]"
                                        style={{ top: `${(question_number - 1 - opponent_progress) * 9.6}rem` }}
                                        alt='progress avatar user 2'
                                    />


                                </div>

                            </div>

                            {/* doors */}
                            <div className='relative  flex flex-col-reverse items-center justify-between h-[40rem]'>
                                {/* start badge */}
                                <Badge variant={'outline'} className='text-white text-sm font-body text-center font-semibold w-[60%] h-[2rem]'>Start</Badge>
                                <div className="absolute top-0 bg-secondary h-[90%] w-[15%] -z-10 rounded-3xl "></div>
                                {
                                    [...Array(question_number)].map((_, idx) => {

                                        const doorResult = question_results[idx];
                                        const doorColour = () => {
                                            if (doorResult === true) return 'bg-success/50'
                                            if (doorResult === false) return 'bg-danger/50'
                                            return 'bg-transparent'
                                        }
                                        return (
                                            <React.Fragment key={`${question_number}-${idx}`}>

                                                <div className=' w-[100%] h-[8rem] flex items-center justify-center col-start-2 '>
                                                    <div className={`${doorColour()} rounded-full p-[1%] flex items-center justify-center`}>
                                                        <img src={door}
                                                            className="w-20 h-20 object-cover rounded-full"
                                                            alt='door'
                                                        />
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        )
                                    })
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}