import React from 'react'
import { TimerCard } from '@/components/features/Match/MatchBox'
import { Progress } from '@/components/ui/progress'
import { MatchCard } from '@/components/features/Match/MatchCard'
import TournamentButton from '@/components/features/Tournaments/TournamentButton'
import { TournamentsBadge } from '@/components/features/Tournaments/TournamentsBadge'
import { RoundTree } from './RoundTree'
import type { QuestionDTO } from 'src/dtos/match/match.dto'
import PlayerAvatar from 'src/avatar/PlayerAvatar'
import Shake from '@/components/ui/Shake'

interface MatchScreenProps {
    player_life: number[],
    seconds: number,
    minutes: number,
    playerOneAvatar: string | null,
    playerTwoAvatar: string | null,
    usernames: string[],
    elos: number[],
    children: React.ReactNode,
    question_number: number,
    current_question: number,
    opponent_progress: number,
    question_results: (boolean | null)[][],
    rounds: QuestionDTO[][],
    current_round: number,
    current_user: string
}

export const MatchScreen: React.FC<MatchScreenProps> = ({
    player_life,
    seconds,
    minutes,
    playerOneAvatar,
    playerTwoAvatar,
    usernames,
    elos,
    children,
    current_question,
    question_results,
    rounds,
    current_round,
    current_user
}) => {

    // const questionsAnswered = question_results.flat().filter((qr) => qr === true || qr === false).length;
    // const progressValue = question_number > 0 ? (questionsAnswered / question_number) * 100 : 0;


    return (
        <div className="fixed inset-0 flex flex-col min-w-[64rem] overflow-y-auto">
            {/* Header */}
            <MatchCard className="rounded-[12px] w-[88%] h-[4rem] shrink-0 m-10 flex items-center px-6 flex-row">
                
                {/* Player 1 Progress */}
                <div className="flex flex-1 min-w-0 items-center gap-2 w-full">
                    <TournamentButton className="shrink-0 w-18 h-12 overflow-hidden">
                        <PlayerAvatar assetKey={playerOneAvatar ?? ""} className="w-full h-full m-auto" viewBox="0 20 300 350" preserveAspectRatio="xMidYMin slice" size={40}/>
                    </TournamentButton>

                    <div className="flex flex-col ml-2 shrink-0">
                        <div className="sm:text-[1.25rem]">{usernames[0]}</div>
                        <h1 className="text-muted-text text-xs">{elos[0]} ELO</h1>
                    </div>

                    <PlayerBadge username={usernames[0]} current_user={current_user}/>

                    <div className='flex flex-1 min-w-0 flex'>
                        <Shake value={player_life[0]} className="w-full flex">
                        <Progress
                            value={player_life[0]}
                            bg="var(--button-tournament-secondary)"
                            border="var(--button-tournament-secondary)"
                            height={3}
                            className={`w-full max-w-[11rem] min-w-[1rem] h-sm mr-auto ml-auto `}
                        />
                        </Shake>
                    </div>
                </div>
                

                {/* Clock */}
                <TimerCard className="shrink-0 mx-5">
                    <span>
                        {String(minutes).padStart(2, "0")}:
                        {String(seconds).padStart(2, "0")}
                    </span>
                </TimerCard>

                {/* Player 2 Progress */}

                {/* the code below was copied and rearranged from the human-written code above for the sake of time, none of this code is ai-generated */}
                <div className="min-w-0 w-xl flex-1 mr-7 h-[6rem] mt-10 shrink-0">
                    <div className="flex flex-row items-center gap-2 w-full mt-3">
                        <div className='w-full'>
                            <Shake value={player_life[1]}>
                            <Progress
                                value={player_life[1]}
                                bg={"var(--button-tournament-secondary)"}
                                border={"var(--button-tournament-secondary"}
                                from={"#8b29b8"}
                                via={"#BF4DF3"}
                                height={3}
                                className='max-w-[11rem] min-w-[1rem] h-sm ml-auto mr-5 -mt-2.5 rotate-180'
                            />
                            </Shake>
                        </div>

                        <PlayerBadge username={usernames[1]} current_user={current_user} />

                        <div className="flex flex-col mr-2">
                            <div className="text-[1.25rem] w-xsm h-sm -mt-2">{usernames[1]}</div>
                            <div className="text-xs text-muted-text ml-auto">{elos[1]} ELO</div>
                        </div>

                        <TournamentButton className="my-auto min-w-0 w-20 h-12 items-center">
                            <PlayerAvatar assetKey={playerTwoAvatar ?? ""} className="w-full h-full bg-no-repeat bg-cover bg-center"/>

                        </TournamentButton>
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
                        <MatchCard className='relative rounded-[20px] flex flex-col-reverse items-center justify-between h-auto w-[7rem] gap-2 p-3 my-auto -mt-5'>
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


interface PlayerBadgeProps {
    username: string,
    current_user: string
}


const PlayerBadge = ({ username, current_user }: PlayerBadgeProps) => {
    return (
        <TournamentsBadge className="flex min-w-9 mr-[0.5%] h-[1.5rem] mb-auto text-muted-text text-xs">
            <h1 className="mt-1">
                {username === current_user ? "YOU" : "RIVAL"}

            </h1>
        </TournamentsBadge>
    )
}