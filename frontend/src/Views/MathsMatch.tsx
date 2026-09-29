import { ChevronRight, ChevronLeft, ChevronUp, ChevronDown } from 'lucide-react'
import { useEffect } from 'react';
import { useMatch } from 'src/ViewModels/MatchViewModel';

import MathMatch from '@/components/features/MathPage';
import { Question } from '@/components/features/question';
import Loading from '@/components/shared/Loading';
import { MatchScreen } from '@/components/shared/Match';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { MatchBox } from '@/components/ui/MatchBox';
import TournamentButton from '@/components/ui/TournamentButton';
import "../../src/styles/global.css"

const MathsMatch = () => {
    const {
        playerLife, avatars, usernames, elos,
        seconds, minutes, questions,
        currentQuestion, opponentCurrent,
        nextQuestion, prevQuestion,
        loading, submitQuestion,
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
            question_results={results}
        >

            <Question
                className={` h-[20rem] mb-5`}
                difficulty={curr.difficulty!}
                title={curr.title!}
                description={curr.description}
                number={currentQuestion + 1}
            />

            <MatchBox className="w-full min-h-40 h-50 rounded-2xl bg-[var(--match-box)] mb-auto -mt-48"></MatchBox>

            <div className='w-[100%] h-full min-h-[35%] flex flex-col items-center justify-center'>
                <MathMatch
                    mathfieldRef={mathfieldRef}
                    onValueChange={(val) => setAnswers(prev => ({ ...prev, [currentQuestion]: val }))}
                    className={`${result_colour()},${read_only}`}
                >
            
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:gap-6 w-full mx-auto mb-6 sm:mb-10 relative">
                <TournamentButton className='flex items-center justify-evenly gap-1 text-secondary px-2 py-1 shrink-0 rounded-2xl'>
                    <ChevronLeft onClick={() => prevQuestion(currentQuestion)} className='size-6 sm:size-7 lg:size-8 hover:scale-110 hover:bg-secondary/20 rounded-2xl' />
                    <ChevronRight onClick={() => nextQuestion(currentQuestion)} className='size-6 sm:size-7 lg:size-8 hover:scale-110 hover:bg-secondary/20 rounded-2xl' />
                </TournamentButton>
                <TournamentButton className='px-4 sm:px-6 py-2 rounded-2xl text-[1.3rem] hover:-translate-y-1 shrink-0'
                    onClick={() => {
                        const answer = mathfieldRef.current?.value ?? '';
                        submitQuestion(curr.id!, 'math', { answer: answer })
                    }}
                >
                    Submit
                </TournamentButton>
                {currentQuestion === (questions.length - 1) &&
                    <TournamentButton className='px-4 sm:px-6 py-2 h-[2.2rem] rounded-2xl text-[1.3rem] hover:-translate-y-1 shrink-0'
                        onClick={() => {
                            finishGame();
                        }}
                    >
                        <p>Finish</p>
                    </TournamentButton>
                }

                <div className="flex flex-row gap-5 absolute right-8 -top-3.5 bg-background-elevated border border-border rounded-2xl py-2 px-2 ">

                    <div className="card-elevated h-11 w-30 rounded-full my-auto">
                        <div className="flex flex-row">
                            <ChevronUp size={30} className="text-secondary/30 mt-1 ml-1"/>
                            <h1 className="text-[1rem] text-secondary/30 font-semibold my-auto mt-2">Powerups</h1>
                        </div>
                    </div>

                    <div className="card-elevated h-11 w-31 rounded-full ">
                        <div className="flex flex-row">
                            <ChevronDown size={28} className="text-secondary/30 mt-1.5 ml-0.5"/>
                            <h1 className="text-[0.9rem] text-secondary/30 font-semibold my-auto mt-2.5">Powerdowns</h1>
                        </div>
                    </div>

                </div>

                </div>
            
                </MathMatch>
            </div>

            {waitingOpponent && (
                <div className="fixed inset-0 z-50  bg-background/60 flex items-center justify-center p-4 ">

                    <Card className="relative w-full max-w-lg rounded-3xl text-center flex flex-col items-center gap-4 p-8 overflow-hidden bg-radial-glow">
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