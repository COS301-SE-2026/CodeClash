import { ChevronRight, ChevronLeft } from 'lucide-react'
import { useEffect } from 'react';
import { useMatch } from 'src/ViewModels/Match/MatchViewModel';

import MathMatch from '@/components/features/Match/MathPage';
import { Question } from '@/components/features/Questions/question';
import Loading from '@/components/shared/Loading';
import { MatchScreen } from '@/components/features/Match/Match';
import { Button } from '@/components/ui/button';
import PopUp from '@/components/shared/PopUp'
import { useUser } from 'src/context/User/hooks/useUser';
import { PowerUpAndDownButtons } from '@/components/features/Match/PowerUpandDownButtons';

const MathsMatch = () => {
    const {
        status,
        questions,
        results,
        playerLife, avatars, usernames,
        seconds, minutes,
        currentQuestion, nextQuestion, prevQuestion,
        roundIdx, rounds,
        opponentCurrent, waitingOpponent, finishMatch,
        loading,
        submitQuestion,
        mathfieldRef,
        elos, colourClass, shake,
        final_question, complete_round, confirmCompleteRound, confirmRound, cancelCompleteRound, completeRound
    } = useMatch();


    const curr = questions[currentQuestion];
    const { username } = useUser();
    useEffect(() => {
        if (mathfieldRef.current) {
            mathfieldRef.current.value = '';
        }
    }, [currentQuestion])

    if (status !== 'ready' || !curr) {
        return (
            <Loading isOpen={loading || status !== 'ready' || !curr}></Loading>
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
            current_user={username}
            shake={shake}
        >

            <Question
                className={` h-[20rem] `}
                difficulty={curr.difficulty!}
                title={curr.title!}
                description={curr.description}
            />
            <div className={`w-[100%] flex items-center justify-center`}>
                <MathMatch
                    mathfieldRef={mathfieldRef}
                    colourClass={colourClass}
                ></MathMatch>
            </div>
            <div className='w-[100%] h-[6rem] flex flex-row flex-shrink-0 items-center justify-evenly rounded-4xl relative'>

                <div className='flex items-center justify-evenly text-secondary bg-primary rounded-2xl w-[15%]'>
                    <ChevronLeft onClick={() => prevQuestion(currentQuestion)} className='size-[3rem] hover:scale-110  hover:bg-secondary/20 rounded-2xl w-[50%]' />
                    <ChevronRight onClick={() => nextQuestion(currentQuestion)} className='size-[3rem] hover:scale-110 hover:bg-secondary/20 rounded-2xl w-[50%]' />
                </div>
                <Button className='w-[20%] h-[2.6rem] rounded-2xl text-[1rem] hover:-translate-y-1'
                    onClick={() => {
                        const answer = mathfieldRef.current?.value ?? '';
                        submitQuestion({ answer: answer })
                    }}
                >
                    Submit Answer
                </Button>
                {final_question ? (

                    <Button className='w-[20%] h-[2.6rem] rounded-2xl text-[1rem] hover:-translate-y-1'
                        onClick={() => { finishMatch(); }}
                    >
                        <p>Finish Match</p>
                    </Button>) :
                    complete_round && (
                        <Button className='w-[20%] h-[2.6rem] rounded-2xl text-[1rem] hover:-translate-y-1'
                            onClick={() => { confirmCompleteRound() }}
                        >
                            <p>Complete Round</p>
                        </Button>
                    )
                }

                {
                    confirmRound && (
                        <div>
                            <p>You won't be able to go back once you've completed a round.</p>
                            <Button onClick={cancelCompleteRound}>Cancel</Button>
                            <Button onClick={completeRound}>Continue</Button>
                        </div>
                    )
                }

                <PowerUpAndDownButtons/>

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