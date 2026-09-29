import { CodeEditor } from "@/components/features/code-editor";
import { Question } from "@/components/features/Questions/question";
import { MatchScreen } from "@/components/features/Match/Match";
import { useMatch } from "src/ViewModels/Match/MatchViewModel"
import { ChevronRight, ChevronLeft } from 'lucide-react'
import Loading from '@/components/shared/Loading';
import { useState, useMemo } from "react";
import TournamentButton from "@/components/features/Tournaments/TournamentButton";
import { MatchCard } from "@/components/features/Match/MatchCard";
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
// import PopUp from "@/components/shared/PopUp";
import { useUser } from 'src/context/User/hooks/useUser';

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
        opponentCurrent, waitingOpponent, finishGame,
        loading,
        submitQuestion,
        elos, colourClass, shake
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
                    <TournamentButton className='w-[10%] h-[2.2rem] my-auto rounded-2xl text-[1.3rem] hover:-translate-y-1'
                        onClick={() => {
                            if (code.trim() && languageId !== null) {
                                submitQuestion({
                                    source_code: code,
                                    language_id: languageId,
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