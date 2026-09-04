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
            {waitingOpponent && (
                <div className="fixed inset-0 z-50  bg-black/50 flex items-center justify-center  ">

                    <Card className="relative bg-primary h-[35rem] w-[50%] rounded-3xl  text-center flex items-center absolute">
                        <h1 className="text-[3rem] heading text-primary-text font-extrabold">
                            Waiting For Opponent To Finish
                        </h1>
                        <h2 className="text-[24rem] font-heading text-md text-primary-text text-center justify-center">
                            Hang on while your opponent finishes up
                        </h2>
                        <Spinner className={` size-120 text-secondary`}></Spinner>
                    </Card>
                </div>
            )

            }

        </MatchScreen>
    )
}