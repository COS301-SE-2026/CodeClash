
import BackButton from './BackButton'
import { useState } from 'react'
import { Progress } from '../ui/progress'
import { Badge } from '../ui/badge'
import React from 'react'
import background from 'src/assets/Background/matchScreen.png'
import question_doors from 'src/assets/Decor/progressDoors.png'
import door from 'src/assets/Decor/door.png'

interface MatchScreenProps {
    player_life: number[],
    colour: string,
    seconds: number,
    minutes: number,
    avatars: string[],
    usernames: string[],
    children: React.ReactNode,
    question_number: number,
    user_progress: number,
    opponent_progres: number
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
    user_progress,
    opponent_progres
}) => {

    const [current_question, setCurrentQuestions] = useState(0);

    const nextQuestion = (curr: number) => {
        if (curr < question_number)
            setCurrentQuestions(curr + 1);
    }

    const prevQuestion = (curr: number) => {
        if (curr > 0)
            setCurrentQuestions(curr - 1)
    }

    return (
        <div className="fixed inset-0 flex flex-col">
            <img src={background} className='absolute w-full -z-10' />
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
            <div className='flex justify-evenly'>
                <div className='flex flex-col w-[70%] h-[40rem]'>
                    <div className='absolute bg-gradient-to-r from-button-primary to-secondary h-[3%] w-[71%] rounded-4xl shadow-[0_4px_6px_rgba(0,0,0,0.3)]'></div>
                    {/* Question box */}

                    <div className='bg-secondary w-[100%] h-[100%] rounded-4xl ml-1 pt-[2rem]'>
                        {children}
                    </div>
                </div>

                {/* Progress bar */}
                <div className='flex flex-col items-center w-[20%] justify-between bg-yellow-300'>
                    <div className="fixed self-center bg-secondary h-[65%] w-[2%] rounded-3xl "></div>

                    <div className='grid grid-cols[20%_80%] bg-red-200 border'>
                        {
                            [...Array(question_number)].map((q, id) => {
                                const door_id = question_number - 1 - id;
                                return (
                                    <React.Fragment key={id}>
                                        <div className=' h-[9rem] bg-blue-300 flex w-[70%]'>
                                            <div className='flex items-center h-[3rem] '>
                                                {user_progress === door_id && (
                                                    <img src={avatars[0]}
                                                        className="w-20 h-20 object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div className='flex items-center h-[3rem]'>
                                                {opponent_progres === door_id && (
                                                    <img src={avatars[1]}
                                                        className="w-20 h-20 object-cover "
                                                    />

                                                )}
                                            </div>
                                        </div>
                                        <div className='bg-green-200 w-[100%]'>
                                            <img src={door}
                                                className="w-20 h-20 object-cover rounded-full"
                                            />
                                        </div>
                                    </React.Fragment>
                                )
                            })
                        }
                    </div>
                    {/* <img src={question_doors} alt='match progress indicator' className='h-[40rem]' /> */}
                    <Badge variant={'outline'} className='text-white text-sm font-body text-center font-semibold w-[90%] h-[2rem]'>Start</Badge>
                </div>
            </div>
        </div>
    )
}