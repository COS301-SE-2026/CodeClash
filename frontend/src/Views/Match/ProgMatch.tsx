import { CodeEditor } from "@/components/features/code-editor";
import { Question } from "@/components/features/Questions/question";
import { MatchScreen } from "@/components/features/Match/Match";
import { useMatch } from "src/ViewModels/Match/MatchViewModel"
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { MatchBox } from "@/components/features/Match/MatchBox";
import Loading from '@/components/shared/Loading';
import { useState } from "react";
import TournamentButton from "@/components/features/Tournaments/TournamentButton";
import { MatchCard } from "@/components/features/Match/MatchCard";
import PopUp from "@/components/shared/PopUp";
import { useUser } from 'src/context/User/hooks/useUser';
import { Button } from "@/components/ui/button";

export const ProgMatch = () => {
    const [code, setCode] = useState('');
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
        elos, colourClass, shake,
        final_question, complete_round, confirmCompleteRound, confirmRound, cancelCompleteRound, completeRound

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
            />

            <MatchBox className="w-full min-h-40 h-50 rounded-lg bg-[var(--match-box)] -mt-4"></MatchBox>

            <MatchCard className="items-center mt-5">
                <CodeEditor
                    handleChange={setCode}
                />


                <div className='flex flex-row gap-6 w-full mx-auto justify-center my-auto'>

                    <TournamentButton className='flex items-center justify-evenly text-secondary rounded-2xl w-[10%] h-auto'>
                        <ChevronLeft onClick={() => prevQuestion(currentQuestion)} className='size-[3rem] hover:scale-110  hover:bg-secondary/20 rounded-2xl w-[50%]' />
                        <ChevronRight onClick={() => nextQuestion(currentQuestion)} className='size-[3rem] hover:scale-110 hover:bg-secondary/20 rounded-2xl w-[50%]' />
                    </TournamentButton>
                    <Button className='w-[20%] h-[2.6rem] rounded-2xl text-[1rem] hover:-translate-y-1'
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

                </div>
            </MatchCard>
            {waitingOpponent && (
                <div className="fixed inset-0 z-50  bg-background/60 flex items-center justify-center p-4 ">

                    <Card className="relative w-full max-w-lg rounded-3xl  text-center flex flex-col items-center gap-4 p-8 overflow-hidden bg-radial-glow">
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

        </MatchScreen >
    )
}