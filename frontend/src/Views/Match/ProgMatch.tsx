import { CodeEditor } from "@/components/features/code-editor";
import { Question } from "@/components/features/question";
import { MatchScreen } from "@/components/shared/Match/Match";
import { useMatch } from "src/ViewModels/Match/MatchViewModel"
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { TimerBox } from "@/components/ui/TimerBox";
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import Loading from '@/components/shared/Loading';
import { useState } from "react";
import TournamentButton from "@/components/ui/TournamentButton";
import { MatchCard } from "@/components/ui/MatchCard";

export const ProgMatch = () => {
    const [code, setCode] = useState('');
    const {
        playerLife, avatars, usernames,
        elos, seconds, minutes, questions,
        currentQuestion, opponentCurrent,
        nextQuestion, prevQuestion,
        results, waitingOpponent,
        finishGame, loading, submitQuestion
    } = useMatch();

    const curr = questions[currentQuestion];

    if (loading || !curr) {
        return (
            <Loading isOpen={loading}></Loading>
        )
    }

    return (
        <MatchScreen
            player_life={playerLife}
            colour="var(--life-primary)"
            seconds={seconds}
            minutes={minutes}
            avatars={avatars}
            usernames={usernames}
            elos={elos}
            current_question={currentQuestion}
            opponent_progress={opponentCurrent}
            question_number={questions.length}
            question_results={results}
        >
            <Question
                className={` h-[10rem]`}
                difficulty={curr.difficulty!}
                title={curr.title!}
                description={curr.description!}
                number={currentQuestion + 1}

            />

            <TimerBox className="w-full min-h-40 h-50 rounded-lg bg-[var(--match-box)] -mt-4"></TimerBox>

            <MatchCard className="items-center mt-5">
                <CodeEditor 
                    handleChange={setCode}
                />
            

                <div className='flex flex-row gap-6 w-full mx-auto justify-center my-auto'>

                    <TournamentButton className='flex items-center justify-evenly text-secondary rounded-2xl w-[10%] h-auto'>
                        <ChevronLeft onClick={() => prevQuestion(currentQuestion)} className='size-[3rem] hover:scale-110  hover:bg-secondary/20 rounded-2xl w-[50%]' />
                        <ChevronRight onClick={() => nextQuestion(currentQuestion)} className='size-[3rem] hover:scale-110 hover:bg-secondary/20 rounded-2xl w-[50%]' />
                    </TournamentButton>
                    <TournamentButton className='w-[10%] h-[2.2rem] my-auto rounded-2xl text-[1.3rem] hover:-translate-y-1'
                        onClick={() => {
                            if (code.trim()) {
                                submitQuestion(curr.id!, 'prog',
                                    {

                                        source_code: code,
                                        language_id: 54,
                                        stdin: null
                                    })
                            }
                        }}
                    >
                        Submit
                    </TournamentButton>
                    {currentQuestion === (questions.length - 1) &&
                        <TournamentButton className='w-[10%] my-auto h-[2.2rem] rounded-2xl text-[1.3rem] hover:-translate-y-1'
                            onClick={() => {
                                finishGame();
                            }}
                        >
                            <p>Finish</p>
                        </TournamentButton>
                    }
                </div>
            </MatchCard>

            {/*Copied from math match */}
            {waitingOpponent && (
                <div className="fixed inset-0 z-50  bg-background/60 flex items-center justify-center p-4 ">

                    <Card className="relative w-full max-w-lg rounded-3xl  text-center flex flex-col items-center gap-4 p-8 overflow-hidden"
                        style={{ background: 'radial-gradient(circle at 50% 15%, #b91551 0%, #850f3b 22%, #630b3c 34%, #0a0008 62%)' }}>
                        <h1 className="text-md text-primary-text font-extrabold whitespace-nowrap">
                            Waiting For Opponent To Finish
                        </h1>
                        <h2 className="text-sm text-primary-text/80 text-center">
                            Hang on while your opponent finishes up
                        </h2>
                        <Spinner className='w-12 h-12 text-secondary'></Spinner>
                    </Card>
                </div>
            )}

        </MatchScreen>
    )
}