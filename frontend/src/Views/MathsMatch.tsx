import { ChevronRight, ChevronLeft } from 'lucide-react'
import { useEffect } from 'react';
import { useMatch } from 'src/ViewModels/MatchViewModel';

import MathMatch from '@/components/features/MathPage';
import { Question } from '@/components/features/question';
import Loading from '@/components/shared/Loading';
import { MatchScreen } from '@/components/shared/Match';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';


const MathsMatch = () => {
    const {
        playerLife, avatars, usernames,
        seconds, minutes, questions,
        currentQuestion, opponentCurrent,
        nextQuestion, prevQuestion,
        loading, submitQuestion,
        mathfieldRef, setAnswers, answers,
        results, gameOver, waitingOpponent,
        finishGame, opponentDone
    } = useMatch();

    const curr = questions[currentQuestion];
    const correct = results[currentQuestion];
    const result_colour = () => {
        if (correct === true) return 'bg-success/50'
        else if (correct === false) return 'bg-danger/50'
        else return 'bg-white'
    }


    const read_only = () => {
        if (gameOver) return 'read-only'
        else return ''
    }

    useEffect(() => {
        if (mathfieldRef.current) {
            mathfieldRef.current.value = answers?.[currentQuestion] ?? ''
        }
    }, [currentQuestion])


    if (loading || !curr) {
        return (
            <Loading isOpen={loading}></Loading>
        )
    }

    return (
        <MatchScreen
            player_life={playerLife}
            colour='var(--life-primary)'
            seconds={seconds}
            minutes={minutes}
            avatars={avatars}
            usernames={usernames}
            current_question={currentQuestion}
            opponent_progress={opponentCurrent}
            question_number={questions.length}
            question_results={results}
            opponent_done={opponentDone}
        >

            <Question
                className={` h-[20rem] `}
                difficulty={curr.difficulty!}
                title={curr.title!}
                description={curr.description}
                number={currentQuestion + 1}
            />

            <div className='w-[100%] h-[100%] min-h-[35%] flex items-center justify-center'>
                <MathMatch
                    mathfieldRef={mathfieldRef}
                    onValueChange={(val) => setAnswers(prev => ({ ...prev, [currentQuestion]: val }))}
                    className={`${result_colour()},${read_only}`}
                ></MathMatch>
            </div>
            <div className='w-[100%] h-[6rem]  flex flex-shrink-0 items-center justify-evenly rounded-4xl'>

                <div className='flex items-center justify-evenly text-secondary bg-primary rounded-2xl w-[15%]'>
                    <ChevronLeft onClick={() => prevQuestion(currentQuestion)} className='size-[3rem] hover:scale-110  hover:bg-secondary/20 rounded-2xl w-[50%]' />
                    <ChevronRight onClick={() => nextQuestion(currentQuestion)} className='size-[3rem] hover:scale-110 hover:bg-secondary/20 rounded-2xl w-[50%]' />
                </div>
                <Button className='w-[20%] h-[2.6rem] rounded-2xl text-[2rem] hover:-translate-y-1'
                    onClick={() => {
                        const answer = mathfieldRef.current?.value ?? '';
                        submitQuestion(curr.id!, answer)
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
            )

            }
        </MatchScreen>
    )

}

export default MathsMatch;