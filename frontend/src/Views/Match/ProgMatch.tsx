import { CodeEditor } from "@/components/features/code-editor";
import { Question } from "@/components/features/question";
import { MatchScreen } from "@/components/shared/Match/Match";
import { useMatch } from "src/ViewModels/Match/MatchViewModel"
import { ChevronRight, ChevronLeft } from 'lucide-react'
import Loading from '@/components/shared/Loading';
import { useState } from "react";
import TournamentButton from "@/components/ui/TournamentButton";
import { MatchCard } from "@/components/ui/MatchCard";
import PopUp from "@/components/shared/PopUp";

export const ProgMatch = () => {
    const [code, setCode] = useState('');
    const {
        status,
        questions,
        results,
        playerLife, avatars, usernames,
        seconds, minutes,
        currentQuestion, nextQuestion, prevQuestion,
        roundIdx, total_rounds, rounds,
        opponentCurrent, waitingOpponent, finishGame,
        loading,
        submitQuestion,
        elos
    } = useMatch();

    const curr = questions[currentQuestion];

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
                                submitQuestion({
                                    source_code: code,
                                    language_id: 54,
                                    stdin: null
                                })
                            }
                        }}
                    >
                        Submit Answer
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
            {waitingOpponent && (
                <PopUp
                    isOpen={waitingOpponent}
                    title={'Waiting For Opponent To Finish'}
                    subtitle={'Hang on while your opponent finishes up'}
                />
            )}

        </MatchScreen >
    )
}