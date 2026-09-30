import { CodeEditor } from "@/components/features/code-editor";
import { Question } from "@/components/features/Questions/question";
import { MatchScreen } from "@/components/features/Match/Match";
import { useMatch } from "src/ViewModels/Match/MatchViewModel"
import { ChevronRight, ChevronLeft } from 'lucide-react'
import Loading from '@/components/shared/Loading';
import { useState, useMemo } from "react";
import TournamentButton from "@/components/features/Tournaments/TournamentButton";
import { MatchCard } from "@/components/features/Match/MatchCard";
import PopUp from "@/components/shared/PopUp";
import { useUser } from 'src/context/User/hooks/useUser';
import { Button } from "@/components/ui/button";

export const ProgMatch = () => {
    const [code, setCode] = useState('');
    const [languageId, setLanguageId] = useState<number | null>(null);

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
        final_question, complete_round, confirmCompleteRound, confirmRound, cancelCompleteRound, completeRound,
        matchType, matchMode
    } = useMatch();

    const curr = questions[currentQuestion];
    const question = useMemo(() => ({ templates: curr.templates }), [curr]);
    const { username } = useUser();

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
            current_user={username}
            shake={shake}
        >
            <Question
                className={` h-[20rem] `}
                difficulty={curr.difficulty!}
                title={curr.title!}
                description={curr.description}
            />

            <MatchCard className={`items-center mt-5 ${colourClass}`}>
                <CodeEditor
                    question={question}
                    onChange={(new_code,  judge0_id) => {
                        setCode(new_code);
                        setLanguageId(judge0_id)
                    }}

                />

                <div className='flex flex-row gap-6 w-full mx-auto justify-center my-auto'>

                    <TournamentButton className='flex items-center justify-evenly text-secondary rounded-2xl w-[10%] h-auto'>
                        <ChevronLeft onClick={() => prevQuestion(currentQuestion)} className='size-[3rem] hover:scale-110  hover:bg-secondary/20 rounded-2xl w-[50%]' />
                        <ChevronRight onClick={() => nextQuestion(currentQuestion)} className='size-[3rem] hover:scale-110 hover:bg-secondary/20 rounded-2xl w-[50%]' />
                    </TournamentButton>
                    <Button className='w-[20%] h-[2.6rem] rounded-2xl text-[1rem] hover:-translate-y-1'
                        onClick={async () => {
                            if (code.trim() && languageId !== null) {
                                await submitQuestion({
                                    source_code: code,
                                    language_id: languageId,
                                    stdin: null
                                }, matchType!,matchMode!)
                            }
                        }}
                    >
                        Submit Answer
                    </Button>
                    {final_question ? (

                        <Button className='w-[20%] h-[2.6rem] rounded-2xl text-[1rem] hover:-translate-y-1'
                            onClick={async () => { await finishMatch(); }}
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
                <PopUp
                    isOpen={waitingOpponent}
                    title={'Waiting For Opponent To Finish'}
                    subtitle={'Hang on while your opponent finishes up'}
                />
            )}

        </MatchScreen >
    )
}