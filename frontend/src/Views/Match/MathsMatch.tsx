import { ChevronRight, ChevronLeft } from 'lucide-react'
import { useEffect } from 'react';
import { useMatch } from 'src/ViewModels/Match/MatchViewModel';

import MathMatch from '@/components/features/MathPage';
import { Question } from '@/components/features/question';
import Loading from '@/components/shared/Loading';
import { MatchScreen } from '@/components/shared/Match';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { TimerBox } from '@/components/ui/TimerBox';
import TournamentButton from '@/components/ui/TournamentButton';

const MathsMatch = () => {
    const {
        playerLife, avatars, usernames, elos,
        seconds, minutes, questions,
        currentQuestion, opponentCurrent,
        nextQuestion, prevQuestion,
        loading,
        // submitQuestion,
        mathfieldRef, setAnswers, answers,
        results, gameOver, waitingOpponent,
        finishGame
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


    if (status !== 'ready') {
        return (
            <Loading isOpen={loading}></Loading>
        )
    }

    return (
        <MatchScreen
            player_life={playerLife}
            colour='var(--button-tournament)'
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
                className={` h-[20rem] `}
                difficulty={curr.difficulty!}
                title={curr.title!}
                description={curr.description}
                number={currentQuestion + 1}
            />

            <TimerBox className="w-full min-h-40 h-50 rounded-lg bg-[var(--match-box)] -mt-43"></TimerBox>

            <div className='w-[100%] h-full min-h-[35%] flex flex-col items-center justify-center'>
                <MathMatch
                    mathfieldRef={mathfieldRef}
                    onValueChange={(val) => setAnswers(prev => ({ ...prev, [currentQuestion]: val }))}
                    className={`${result_colour()},${read_only}`}
                >
            
                <div className="flex flex-row gap-6 w-full mx-auto justify-center my-auto">
                <TournamentButton className='flex items-center justify-evenly text-secondary rounded-2xl w-[10%] h-auto'>
                    <ChevronLeft onClick={() => prevQuestion(currentQuestion)} className='size-[2rem] hover:scale-110  hover:bg-secondary/20 rounded-2xl w-[50%]' />
                    <ChevronRight onClick={() => nextQuestion(currentQuestion)} className='size-[2rem] hover:scale-110 hover:bg-secondary/20 rounded-2xl w-[50%]' />
                </TournamentButton>
                <TournamentButton className='w-[10%] h-[2.2rem] rounded-2xl text-[1.3rem] hover:-translate-y-1'
                    onClick={() => {
                        // const answer = mathfieldRef.current?.value ?? '';
                        // submitQuestion(curr.id!, 'math', { answer: answer })
                    }}
                >
                    Submit
                </TournamentButton>
                {currentQuestion === (questions.length - 1) &&
                    <TournamentButton className='w-[10%] h-[2.2rem] rounded-2xl text-[1.3rem] hover:-translate-y-1'
                        onClick={() => {
                            finishGame();
                        }}
                    >
                        <p>Finish</p>
                    </TournamentButton>
                }
                </div>
            
                </MathMatch>
            </div>

            {waitingOpponent && (
                <Popup

                    isOpen={waitingOpponent}
                    title={'Waiting For Opponent To Finish'}
                    subtitle={'Hang on while your opponent finishes up'}
                />
            )

            }
        </MatchScreen>
    )

}

export default MathsMatch;