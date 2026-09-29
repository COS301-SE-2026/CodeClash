import { ChevronRight, ChevronLeft, ChevronUp, ChevronDown } from 'lucide-react'
import { useEffect } from 'react';
import { useMatch } from 'src/ViewModels/Match/MatchViewModel';

import MathMatch from '@/components/features/Match/MathPage';
import { Question } from '@/components/features/Questions/question';
import Loading from '@/components/shared/Loading';
import { MatchScreen } from '@/components/features/Match/Match';
import { Button } from '@/components/ui/button';
import Popup from '@/components/shared/PopUp';
import "../../../src/styles/global.css"

const MathsMatch = () => {
    const {
        status,
        questions,
        results,
        playerLife, avatars, usernames,
        seconds, minutes,
        currentQuestion,
        nextQuestion, prevQuestion,
        roundIdx, rounds,
        opponentCurrent, waitingOpponent, finishGame,
        loading, 
        submitQuestion,
        mathfieldRef, 
        elos
    } = useMatch();

    const curr = questions[currentQuestion];
    

    useEffect(() => {
        if (mathfieldRef.current) {
            mathfieldRef.current.value = '';
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
            seconds={seconds}
            minutes={minutes}
            avatars={avatars}
            usernames={usernames}
            elos={elos}
            current_question={currentQuestion}
            opponent_progress={opponentCurrent}
            question_number={questions.length}
            question_results={results ?? []}
            rounds={rounds}
            current_round={roundIdx}
        >

            <Question
                className={` h-[20rem] mb-5`}
                difficulty={curr.difficulty!}
                title={curr.title!}
                description={curr.description}
            />

            
            <div className='w-[100%] h-[100%] min-h-[35%] flex items-center justify-center'>
                <MathMatch
                    mathfieldRef={mathfieldRef}
                >
                </MathMatch>
            </div>

            {/* the code below was copied from a more updated version of this file that wasn't merged properly,
            all this code was written by a human and was not generated with ai */}
            
            <div className='w-[100%] h-[6rem] flex flex-shrink-0 items-center justify-evenly rounded-4xl'>

                <div className='flex items-center justify-evenly text-secondary bg-primary rounded-2xl w-[15%]'>
                    <ChevronLeft onClick={() => prevQuestion(currentQuestion)} className='size-[3rem] hover:scale-110  hover:bg-secondary/20 rounded-2xl w-[50%]' />
                    <ChevronRight onClick={() => nextQuestion(currentQuestion)} className='size-[3rem] hover:scale-110 hover:bg-secondary/20 rounded-2xl w-[50%]' />
                </div>
                <Button className='w-[20%] h-[2.6rem] rounded-2xl text-[2rem] hover:-translate-y-1'
                    onClick={() => {
                        const answer = mathfieldRef.current?.value ?? '';
                        submitQuestion({ answer: answer })
                    }}
                >
                    Submit Answer
                </Button>
                {currentQuestion === (questions.length - 1) &&
                    <Button className='w-[20%] h-[2.6rem] rounded-2xl text-[2rem] hover:-translate-y-1'
                        onClick={() => {
                            finishGame();
                        }}
                    >
                        <p>Finish</p>
                    </Button>
                }
            </div>

            {waitingOpponent && (
                <Popup
                    isOpen={waitingOpponent}
                    title={'Waiting For Opponent To Finish'}
                    subtitle={'Hang on while your opponent finishes up'}
                />
            )

            }
        </MatchScreen >
    )

}

export default MathsMatch;