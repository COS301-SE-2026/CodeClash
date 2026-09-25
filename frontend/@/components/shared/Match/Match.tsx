import React from 'react'
import { TimerBox } from '@/components/ui/TimerBox'
import { Progress } from '@/components/ui/progress'
import { Timer } from "lucide-react"
import { MatchCard } from '@/components/ui/MatchCard'
import TournamentButton from '@/components/ui/TournamentButton'
import { TournamentsBadge } from '@/components/ui/TournamentsBadge'
import { RoundTree } from './RoundTree'
import type { QuestionDTO } from 'src/dtos/match/match.dto'

interface MatchScreenProps {
    player_life: number[],
    seconds: number,
    minutes: number,
    avatars: string[],
    usernames: string[],
    elos: number[],
    children: React.ReactNode,
    question_number: number,
    current_question: number,
    opponent_progress: number,
    question_results: (boolean | null)[][],
    rounds: QuestionDTO[][],
    current_round: number
}

export const MatchScreen: React.FC<MatchScreenProps> = ({
    player_life,
    seconds,
    minutes,
    avatars,
    usernames,
    elos,
    children,
    // question_number,
    current_question,
    // opponent_progress,
    question_results,
    rounds,
    current_round
}) => {

    // const questionsAnswered = question_results.flat().filter((qr) => qr === true || qr === false).length;
    // const progressValue = question_number > 0 ? (questionsAnswered / question_number) * 100 : 0;

    return (
        <div className="fixed inset-0 flex flex-col min-w-[64rem] overflow-y-auto">
            {/* <img src={background} className='absolute w-full -z-10' alt='background' /> */}
            {/* <BackButton page='/dashboard' /> */}
            {/* Header */}
            <MatchCard className="rounded-[12px] w-[88%] h-[4rem] shrink-0 mb-10 mt-10 ml-10 mr-10 flex items-center overflow-x-auto">
                <div className="flex w-full h-full items-center gap-2">

                    {/* Player 1 Progress */}
                    <div className="shrink-0 min-w-0 w-xl flex-1 ml-7 h-[6rem] mt-10">
                        <div className="flex flex-row items-center gap-2 w-full mt-2">
                            <TournamentButton className="my-auto min-w-0 w-18 h-12 items-center -px-1 -py-4 -ml-3 -mt-1 my-auto">
                                <div style={{ backgroundImage: `url(${avatars[0]})` }} className="w-full h-full bg-no-repeat bg-cover bg-center">

                                </div>
                            </TournamentButton>

                            <div className="flex flex-col ml-2">
                                <div className="sm:text-[1.25rem] h-sm -mt-2">{usernames[0]}</div>
                                <h1 className="text-muted-text text-xs">{elos[0]} ELO</h1>
                            </div>

                            <TournamentsBadge className="flex min-w-7 ml-[0.5%] h-[1.5rem] mb-auto text-muted-text text-xs -mr-4 -mt-1">
                                <h1 className="mt-1">YOU</h1>
                            </TournamentsBadge>

                            <div className='w-full'>
                                <Progress
                                    value={player_life[0]}
                                    bg="var(--button-tournament-secondary)"
                                    border="var(--button-tournament-secondary)"
                                    height={2.5}
                                    className='max-w-[11rem] min-w-[1rem] h-sm mr-auto ml-5 -mt-1'
                                />
                            </div>
                        </div>
                    </div>

                    {/* Clock */}
                    <TimerBox className='shrink-0 text-white font-dseg border border-[var(--match-card)] 
                h-6 w-38 flex items-center justify-center text-[70%] text-center font-semibold rounded-sm px-2 my-auto -mt-4.5'>
                        <div className="flex flex-row whitespace-wrap">
                            <Timer size={20} className="mr-3 my-auto text-muted-text" />
                            <span>
                                {String(minutes).padStart(2, "0")}:
                                {String(seconds).padStart(2, "0")}
                            </span>
                        </div>
                    </TimerBox>

                    {/* Player 2 Progress */}

                    {/* the code below was copied and rearranged from the human-written code above for the sake of time, none of this code is ai-generated */}
                    <div className="min-w-0 w-xl flex-1 mr-7 h-[6rem] mt-10 shrink-0">
                        <div className="flex flex-row items-center gap-2 w-full mt-3">
                            <div className='w-full'>
                                <Progress
                                    value={player_life[1]}
                                    bg={"var(--button-tournament-secondary)"}
                                    border={"var(--button-tournament-secondary"}
                                    from={"#8b29b8"}
                                    via={"#BF4DF3"}
                                    height={2.5}
                                    className='max-w-[11rem] min-w-[1rem] h-sm ml-auto mr-5 -mt-2.5 rotate-180'
                                />
                            </div>

                            {/* the code below was copied and pasted from above and was written by a human, this code was not ai generated! */}
                            <TournamentsBadge className="flex min-w-9 mr-[0.5%] h-[1.5rem] mb-auto text-muted-text text-xs -mt-2">
                                <h1 className="mt-1">RIVAL</h1>
                            </TournamentsBadge>


                            <div className="flex flex-col mr-2">
                                <div className="text-[1.25rem] w-xsm h-sm -mt-2">{usernames[1]}</div>
                                <div className="text-xs text-muted-text ml-auto">{elos[1]} ELO</div>
                            </div>

                            <TournamentButton className="my-auto min-w-0 w-20 h-12 items-center -px-1 -py-4 -mr-3 -mt-2.5">
                                <div style={{ backgroundImage: `url(${avatars[1]})` }} className="w-full h-full bg-no-repeat bg-cover bg-center">

                                </div>
                            </TournamentButton>
                        </div>
                    </div>
                </div>
            </MatchCard>


            {/* Body */}
            <div className='flex justify-evenly'>
                <div className='flex flex-col w-[80%] h-[40rem] ml-10'>
                    <div>
                        {children}
                    </div>
                </div>

                {/* Progress bar */}
                <div className='flex flex-col items-center w-[20%] justify-between'>
                    {/* progress  */}
                    <div className='my-auto ml-[40%] w-[100%] flex'>
                        <MatchCard className='relative rounded-[20px] flex flex-col-reverse items-center justify-between h-auto w-[5rem] gap-2 p-3'>
                            <RoundTree
                            rounds={rounds}
                            results={question_results}
                            current_question={current_question}
                            current_round={current_round}
                            />

                        </MatchCard>

                    </div>
                </div>
            </div>
        </div>
    )
}