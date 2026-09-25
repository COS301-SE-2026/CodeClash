import { ChevronRight, ChevronLeft } from 'lucide-react'
import { useEffect } from 'react';
import { useMatch } from 'src/ViewModels/Match/MatchViewModel';

import MathMatch from '@/components/features/MathPage';
import { Question } from '@/components/features/question';
import Loading from '@/components/shared/Loading';
import { MatchScreen } from '@/components/shared/Match/Match';
import { Button } from '@/components/ui/button';
import PopUp from '@/components/shared/PopUp'

const MathsMatch = () => {
    const {
        status,
        questions,
        results,
        playerLife, avatars, usernames,
        seconds, minutes,
        currentQuestion, nextQuestion, prevQuestion, 
        roundIdx,total_rounds,rounds,
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


    if (status !== 'ready' || !curr) {
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
                className={` h-[20rem] `}
                difficulty={curr.difficulty!}
                title={curr.title!}
                description={curr.description}
                number={currentQuestion + 1}
                round_number={roundIdx}
                total_rounds={total_rounds}
            />

            <div className='w-[100%] h-[100%] min-h-[35%] flex items-center justify-center'>
                <MathMatch
                    mathfieldRef={mathfieldRef}
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
                <PopUp
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