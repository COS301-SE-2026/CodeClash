import React from 'react'
import background from 'src/assets/Background/matchScreen.png'

import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import {Check, X, LockKeyhole, Timer} from "lucide-react"
import { MatchCard } from '../ui/MatchCard'
import TournamentButton from '../ui/TournamentButton'
import { TournamentsBadge } from '../ui/TournamentsBadge'

interface MatchScreenProps {
    player_life: number[],
    colour: string,
    seconds: number,
    minutes: number,
    avatars: string[],
    usernames: string[],
    elos: number[],
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
    elos,
    children,
    question_number,
    current_question,
    opponent_progress,
    question_results,
}) => {

    return (
        <div className="fixed inset-0 flex flex-col min-w-[64rem] overflow-hidden">
            {/* <img src={background} className='absolute w-full -z-10' alt='background' /> */}
            {/* <BackButton page='/dashboard' /> */}
            {/* Header */}
            <MatchCard className="rounded-[12px] min-w-220 h-[4rem] shrink-0 mb-10 mt-10 ml-[3%] mr-[3%] flex items-center">
            <div className="flex w-full h-full items-center justify-between gap-2">
                
                {/* Player 1 Progress */}
                <div className="min-w-0 w-xl flex-1 ml-7 h-[6rem] mt-10">
                    <div className="flex flex-row items-center gap-2 w-full">
                        <TournamentButton className="my-auto min-w-0 w-28 h-15 items-center -px-1 -py-4 -ml-1 -mt-2.5">
                            <div style={{backgroundImage : `url(${avatars[0]})`}} className="w-full h-full bg-no-repeat bg-cover bg-center">

                            </div>
                        </TournamentButton>

                        <div className="flex flex-col ml-2">
                            <div className="sm:text-[1.25rem] h-sm -mt-1">{usernames[1]}</div>
                            <h1 className="text-muted-text text-xs">{elos[0]} ELO</h1>
                        </div>

                        <TournamentsBadge className="flex min-w-7 ml-[0.5%] h-[1.5rem] mb-auto text-muted-text text-xs">
                            <h1 className="mt-1">YOU</h1>
                        </TournamentsBadge>

                        <div className='w-full'>
                            <Progress
                                value={player_life[0]}
                                bg="var(--button-tournament-secondary)"
                                border="var(--button-tournament-secondary)"
                                height={2.5}
                                className='max-w-[12rem] min-w-[2rem] h-sm mr-auto ml-5 -mt-1'
                            />
                        </div>
                    </div>
                </div>

                {/* Clock */}
                <div className='text-white font-dseg bg-[var(--match-box)] border border-[0.5px] border-[var(--match-card)] h-12 w-42 flex items-center justify-center text-lg text-center font-semibold rounded-sm px-2 my-auto mx-auto'>
                    <div className="flex flex-row whitespace-wrap">
                        <Timer size={30} className="mr-2 my-auto"/>
                        <span>
                            {String(minutes).padStart(2, "0")}:
                            {String(seconds).padStart(2, "0")}
                        </span>
                    </div>
                </div>

                {/* Player 2 Progress */}

                {/* the code below was copied and rearranged from the human-written code above for the sake of time, none of this code is ai-generated */}
                <div className="min-w-lg w-xl mr-7 h-[6rem] mt-10">
                    <div className="flex flex-row items-center gap-2 w-full">
                        <div className='w-full'>
                            <Progress
                                value={player_life[0]}
                                bg={"var(--button-tournament-secondary)"}
                                border={"var(--button-tournament-secondary"}
                                height={2.5}
                                className='w-[12rem] h-sm mx-auto mr-3 -mt-1 rotate-180'
                            />
                        </div>

                        {/* the code below was copied and pasted from above and was written by a human, this code was not ai generated! */}
                        <TournamentsBadge className="w-[15%] ml-2 h-[1.5rem] mb-auto text-muted-text text-xs mr-2">
                            <h1 className="mt-1">RIVAL</h1>
                        </TournamentsBadge>


                        <div className="flex flex-col mr-2">
                            <div className="text-[1.25rem] w-xsm h-sm -mt-1">{usernames[1]}</div>
                            <div className="text-xs text-muted-text ml-auto">{elos[1]} ELO</div>
                        </div>

                        <TournamentButton className="my-auto w-[7.5rem] h-[4rem] items-center -px-1 -py-4 mr-4 -mt-2.5">
                            <div style={{backgroundImage : `url(${avatars[0]})`}} className="w-full h-full bg-no-repeat bg-cover bg-center">

                            </div>
                        </TournamentButton>
                    </div>
                </div>
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


                        <div className='grid grid-cols-2 w-[100%] gap-5'>

                            {/* avatars in bottom corner*/}
                            <div className='relative flex flex-row -ml-10'>
                                <img src={avatars[0]}
                                    className=" absolute w-35 h-45 object-cover left-22"
                                    style={{ top: `${(question_number - 1 - current_question) * 9.6}rem` }}
                                    alt='progress avatar user 1'
                                />
                                <div className='relative w-[50%]'>
                                    <img src={avatars[0]}
                                        className=" absolute w-35 h-45 object-cover -left-2 scale-x-[-1]"
                                        style={{ top: `${(question_number - 1 - opponent_progress) * 9.6}rem` }}
                                        alt='progress avatar user 2'
                                    />


                                </div>

                            </div>

                            {/* doors */}
                            <div className='relative bg-card/100 rounded-[20px] flex flex-col-reverse items-center justify-between h-160 w-[5rem] mt-2'>
                                <div className="absolute top-9 bg-card h-[90%] w-[5%] -z-10 rounded-3xl "></div>
                                {
                                    [...Array(question_number)].map((_, idx) => {

                                        const doorResult = question_results[idx];
                                        const doorColour = () => {
                                            if (doorResult === true) return 'bg-success/30 shadow-[0_0_10px_var(--success)]'
                                            if (doorResult === false) return 'bg-danger/30 shadow-[0_0_10px_var(--danger)]'
                                            return 'bg-card'
                                        }
                                        const doorSymbol = () => {
                                            if (doorResult === true) return <Check size={40} className="text-green-300 font-semibold"/>
                                            if (doorResult === false) return <X size={40} className="text-[var(--progress-bar-symbol)] font-semibold"/>
                                            return <LockKeyhole/>
                                        }
                                        return (
                                            <React.Fragment key={`${question_number}-${idx}`}>

                                                <div className={`${doorColour()} w-[4rem] h-[4rem] flex items-center justify-center col-start-2 rounded-[15px] mt-5 mb-5`}>
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