import React from 'react'
import background from 'src/assets/Background/matchScreen.png'

import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import {Check, X, LockKeyhole, Timer} from "lucide-react"
import { MatchCard } from '../ui/MatchCard'
import TournamentButton from '../ui/TournamentButton'


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
}) => {


    return (
        <div className="fixed inset-0 flex flex-col">
            <img src={background} className='absolute w-full -z-10' alt='background' />
            {/* <BackButton page='/dashboard' /> */}
            {/* Header */}
            <MatchCard className="min-w-240 max-w-480 h-25 min-h-[10rem] shrink-0 mb-10 mt-10 ml-15 flex items-center">
            <div className='flex w-full h-full items-center justify-between '>
                
                {/* Player 1 Progress */}
                <MatchCard className="w-lg ml-7 h-[6rem]">
                    <div className="flex flex-row items-center gap-2 w-full">
                        <TournamentButton className="my-auto w-[6.5rem] h-[4rem] items-center -px-1 -py-4 ml-4 -mt-2.5">
                            <div style={{backgroundImage : `url(${avatars[0]})`}} className="w-full h-full bg-no-repeat bg-cover bg-center">

                            </div>
                        </TournamentButton>

                        <Badge variant={'default'} className="text-[1.25rem] w-xsm h-sm -mt-1">{usernames[1]}</Badge>


                        <div className='w-full'>
                            <Progress
                                value={player_life[0]}
                                progress_colour={colour}
                                className='w-[10rem] h-sm shadow-[0_4px_6px_rgba(0,0,0,0.3)] ml-auto mr-4 -mt-1'
                            />
                        </div>
                    </div>
                </MatchCard>

                {/* Clock */}
                <div className='text-white font-dseg bg-[var(--progress-bar-symbol)] h-15 w-50 flex items-center justify-center text-lg text-center font-semibold rounded-sm px-2 my-auto mx-auto mt-4'>
                    <div className="flex flex-row">
                        <Timer size={30} className="mr-2 my-auto"/>
                        <span>
                            {String(minutes).padStart(2, "0")}:
                            {String(seconds).padStart(2, "0")}
                        </span>
                    </div>
                </div>

                {/* Player 2 Progress */}

                {/* the code below was copied and rearranged from the human-written code above for the sake of time, none of this code is ai-generated */}
                <MatchCard className="w-lg mr-7 h-[6rem]">
                    <div className="flex flex-row items-center gap-2 w-full">
                        <div className='w-full'>
                            <Progress
                                value={player_life[0]}
                                progress_colour={colour}
                                className='w-[10rem] h-sm shadow-[0_4px_6px_rgba(0,0,0,0.3)] mr-auto ml-4 -mt-1'
                            />
                        </div>

                        <Badge variant={'default'} className="text-[1.25rem] w-xsm h-sm -mt-1">{usernames[1]}</Badge>


                        <TournamentButton className="my-auto w-[6.5rem] h-[4rem] items-center -px-1 -py-4 mr-4 -mt-2.5">
                            <div style={{backgroundImage : `url(${avatars[0]})`}} className="w-full h-full bg-no-repeat bg-cover bg-center">

                            </div>
                        </TournamentButton>
                    </div>
                </MatchCard>
            </div>
            </MatchCard>


            {/* Body */}
            <div className='flex justify-evenly'>
                <div className='flex flex-col w-[70%] h-[40rem]'>
                    {/* <div className='absolute bg-gradient-to-r from-button-primary to-secondary h-[3%] w-[71%] rounded-4xl shadow-[0_4px_6px_rgba(0,0,0,0.3)]'></div> */}
                    
                    {/* Question box */}

                    <div 
                    // className='bg-[var(--match-card)] w-[100%] h-[100%] rounded-4xl ml-1 pt-[2rem] flex flex-col justify-between items-center'
                    >
                        {children}
                    </div>
                </div>

                {/* Progress bar */}
                <div className='flex flex-col items-center w-[20%] justify-between'>

                    {/* progress  */}
                    <div className='w-[100%] flex'>


                        <div className='grid grid-cols-2 w-[100%] mr-2'>

                            {/* avatars in bottom corner*/}
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
                            <div className='relative bg-card/100 rounded-[20px] flex flex-col-reverse items-center justify-between h-[40rem] w-[5rem] py-6 mt-2'>
                                <div className="absolute top-0 bg-card h-[90%] w-[5%] -z-10 rounded-3xl "></div>
                                {
                                    [...Array(question_number)].map((_, idx) => {

                                        const doorResult = question_results[idx];
                                        const doorColour = () => {
                                            if (doorResult === true) return 'bg-success/30'
                                            if (doorResult === false) return 'bg-danger/30'
                                            return 'bg-card'
                                        }
                                        const doorSymbol = () => {
                                            if (doorResult === true) return <Check size={40} className="text-green-300 font-semibold"/>
                                            if (doorResult === false) return <X size={40} className="text-[var(--progress-bar-symbol)] font-semibold"/>
                                            return <LockKeyhole/>
                                        }
                                        return (
                                            <React.Fragment key={`${question_number}-${idx}`}>

                                                <div className={`${doorColour()} w-[4rem] h-[4rem] flex items-center justify-center col-start-2 rounded-[15px]`}>
                                                    {doorSymbol()}  
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