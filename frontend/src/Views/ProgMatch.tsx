import { CodeEditor } from "@/components/features/code-editor";
import { Question } from "@/components/features/question";
import { MatchScreen } from "@/components/shared/Match";
import { useMatch } from "src/ViewModels/MatchViewModel"
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import Loading from '@/components/shared/Loading';
import { useState } from "react";

export const ProgMatch = () => {
    const [code, setCode] = useState('');
    const {
        playerLife, avatars, usernames,
        seconds, minutes, questions,
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

            <div className="bg-red-300 flex items-center w-[80%] self-center">
                <CodeEditor
                    handleChange={setCode}
                />
            </div>

            <div className='w-[100%] h-[6rem]  flex flex-shrink-0 items-center justify-evenly rounded-4xl'>

                <div className='flex items-center justify-evenly text-secondary bg-primary rounded-2xl w-[15%]'>
                    <ChevronLeft onClick={() => prevQuestion(currentQuestion)} className='size-[3rem] hover:scale-110  hover:bg-secondary/20 rounded-2xl w-[50%]' />
                    <ChevronRight onClick={() => nextQuestion(currentQuestion)} className='size-[3rem] hover:scale-110 hover:bg-secondary/20 rounded-2xl w-[50%]' />
                </div>
                <Button className='w-[20%] h-[2.6rem] rounded-2xl text-[2rem] hover:-translate-y-1'
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
                    SUBMIT
                </Button>
                {currentQuestion === (questions.length - 1) &&
                    <Button className='w-[20%] h-[2.6rem] rounded-2xl text-[2rem] hover:-translate-y-1'
                        onClick={() => {
                            finishGame();
                        }}
                    >
                        <p>FINISH</p>
                    </Button>
                }
            </div>

            {/*Copied from math match */}
            {waitingOpponent && (
                <div className="fixed inset-0 z-50  bg-background/60 flex items-center justify-center p-4 ">

                    <Card className="relative w-full max-w-lg rounded-3xl  text-center flex flex-col items-center gap-4 p-8 overflow-hidden"
                        style={{background: 'radial-gradient(circle at 50% 15%, #b91551 0%, #850f3b 22%, #630b3c 34%, #0a0008 62%)'}}>
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