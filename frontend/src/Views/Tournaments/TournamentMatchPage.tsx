import { MatchCard } from "@/components/features/Match/MatchCard";
import TournamentButton from "@/components/features/Tournaments/TournamentButton";
import { Trophy, Lock, ChevronsRight, Signal, Zap } from "lucide-react"
import { Question } from "@/components/features/Questions/question";
import { TimerCard } from "@/components/features/Match/MatchBox";
import { LiveTournamentPlayer } from "@/components/features/Tournaments/LiveTournamentPlayer";
import { useTournamentMatch } from "src/ViewModels/Tournaments/TournamentMatchViewModel";
import { Button } from "@/components/ui/button";
import MathMatch from "@/components/features/Match/MathPage";
import { CodeEditor } from "@/components/features/code-editor";
import { useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";

const TournamentsMatchPage = () => {
    const {
        roundIdx, activePlayers,
        seconds, minutes,
        questions, currentQuestion,
        db_id,
        round_telemetry,
        mathfieldRef,
        colourClass,
        setCode,
        setLanguageId,
        handleSubmit, match_mode,
        nextQuestion,
        finishMatch,
        final_question,
        complete_round,
        confirmCompleteRound,
        confirmRound,
        cancelCompleteRound,
        completeTournamentRound,
        total_rounds
    } = useTournamentMatch();


    const curr = questions[currentQuestion];
    const question = useMemo(() => ({ templates: curr?.templates }), [curr]);
    const telemetry = round_telemetry();
    const my_rank = (telemetry && telemetry.my_rank! > 0) ? telemetry.my_rank : "-";

    useEffect(() => {
        if (mathfieldRef.current) mathfieldRef.current.value = '';
    }, [currentQuestion]);

    return (
        <div className="m-6 min-h-screen flex flex-col gap-6">
            <MatchCard className="rounded-[12px] w-full min-h-[4.5rem] px-4 py-2
                shrink-0 flex items-center overflow-x-auto">
                <div className="flex flex-row items-center justify-between gap-4 w-full">
                    <div className="flex flex-row items-center gap-4">
                        <TournamentButton className="rounded-[10px] min-w-0 w-11 h-11 flex items-center justify-center">
                            <Trophy size={20} className="text-[var(--match-box)] mx-auto" />
                        </TournamentButton>
                        <div className="flex flex-col ml-4">
                            <h1 className="font-semibold text-secondary text-[1.1rem] mt-1">Round {roundIdx + 1}/ {total_rounds}</h1>
                            <div className="text-muted-text text-[0.7rem] -mt-0.5">{activePlayers.length} Players Remaining</div>
                        </div>
                    </div>

                    <Badge
                        variant={'ghost'}
                        className="text-sm"
                    >
                        Question {currentQuestion + 1} / {questions.length}
                    </Badge>

                    <TimerCard className="mr-2.5">
                        <span>
                            {String(minutes).padStart(2, "0")}:
                            {String(seconds).padStart(2, "0")}
                        </span>
                    </TimerCard>
                </div>
            </MatchCard>

            <div className="flex flex-col lg:flex-row items-start gap-6">
                <MatchCard className="flex-1 w-full lg:w-2/3 p-5 rounded-2xl">
                    <div className="flex flex-col gap-5">
                        <Question
                            difficulty={curr?.difficulty ?? " "}
                            title={curr?.title ?? " "}
                            description={curr?.description ?? " "}
                        />

                        <MatchCard className="items-center p-3 overflow-hidden">
                            {match_mode === "math" && (
                                <MathMatch
                                    mathfieldRef={mathfieldRef}
                                    colourClass={colourClass}
                                >
                                </MathMatch>
                            )}

                            {match_mode === 'programming' && (
                                <CodeEditor
                                    question={question}
                                    onChange={(new_code, judge0_id) => {
                                        setCode(new_code);
                                        setLanguageId(judge0_id)
                                    }}

                                />
                            )}
                        </MatchCard>

                        <hr className="border-muted-text/40"></hr>

                        <div className="flex flex-row items-center justify-between gap-4 flex-wrap">
                            <div className="flex flex-row items-center gap-2">
                                <Lock size={18} className="text-muted-text shrink-0" />
                                <p className="text-muted-text text-xs">Answers lock automatically at round expiry</p>
                            </div>

                            <div className="flex flex-row items-center gap-3">
                                <Button
                                    className="btn btn-primary"
                                    variant={"default"}
                                    onClick={handleSubmit}
                                >
                                    <div className="flex flex-row items-center gap-2">
                                        <h1 className="font-semibold">Submit Answer</h1>
                                        <ChevronsRight size={24} />
                                    </div>
                                </Button>



                                {currentQuestion < questions.length - 1 ? (<Button
                                    className="px-4 py-2 rounded-lg"
                                    variant={"ghost"}
                                    onClick={() => nextQuestion(currentQuestion)}
                                    disabled={currentQuestion >= questions.length - 1}
                                >
                                    <div className="flex flex-row items-center gap-2">
                                        <h1>Next</h1>
                                        <ChevronsRight size={30} />
                                    </div>
                                </Button>) :
                                    final_question ? (

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
                                            <Button onClick={completeTournamentRound}>Continue</Button>
                                        </div>
                                    )
                                }
                                {currentQuestion == questions.length - 1 && <Button
                                    className="px-4 py-2 rounded-lg"
                                    variant={"ghost"}
                                    onClick={() => finishMatch()}
                                >
                                    <div className="flex flex-row items-center gap-2">
                                        <h1>Finish</h1>
                                        <ChevronsRight size={30} />
                                    </div>
                                </Button>}
                            </div>

                        </div>


                    </div>
                </MatchCard>

                <div className="flex flex-col gap-4 w-full lg:w-[380px] shrink-0">
                    <MatchCard className="flex flex-col gap-4 p-5 rounded-2xl">
                        <div className="flex flex-row items-center justify-between">
                            <div className="flex flex-row items-center gap-2">
                                <Signal size={18} className="text-primary" />
                                <h1 className="text-[1rem] font-semibold">Live Standings</h1>
                            </div>
                            <MatchCard className="flex items-center bg-[var(--multiple-choice-box)] text-muted-text px-3 py-1 rounded-full text-xs font-semibold">Round {roundIdx + 1}</MatchCard>
                        </div>

                        <hr className="border-muted-text/50" />

                        <div className="flex flex-col gap-2">
                            {telemetry.safe.map((p) => {
                                return (
                                    <LiveTournamentPlayer
                                        key={p.id}
                                        place={p.position}
                                        username={p.username}
                                        time={(p.total_time / 1000).toFixed() + "s"}
                                        you={p.id === db_id}
                                    />
                                )
                            })
                            }

                            {telemetry.in_danger.length > 0 && (
                                <>
                                    <hr className="border-dotted border-muted-text/40 my-2" />

                                    <div className="rounded-[13px] flex flex-row items-center gap-2 px-3 py-2.5 bg-red-500/10 border border-red-400/20">
                                        <div className="rounded-full bg-red-800 size-2 shrink-0 animate-pulse"></div>
                                        <h1 className="text-red-200/60 text-xs font-semibold uppercase tracking-wide">Elimination Zone</h1>

                                        <div className="text-muted-text ml-auto text-xs">
                                            {telemetry.in_danger.length} below line
                                        </div>
                                    </div>

                                    {
                                        telemetry.in_danger.map((p) => (
                                            <LiveTournamentPlayer
                                                key={p.id}
                                                place={p.position}
                                                username={p.username}
                                                time={(p.total_time / 1000).toFixed() + "s"}
                                                you={p.id === db_id}
                                            />
                                        ))
                                    }

                                </>)
                            }
                        </div>


                    </MatchCard>


                    <MatchCard className="flex flex-col gap-4 p-5 rounded-2xl">
                        <div className="flex flex-row items-center gap-2">
                            <Zap size={18} className="text-primary" />
                            <h1 className="text-[1rem] font-semibold">Round Telemetry</h1>
                            <div className="flex items-center gap-1.5 bg-primary/20 border border-primary rounded-[5px] px-2 py-0.5 ml-auto">
                                <div className="bg-primary size-1 rounded-full animate-pulse"></div>
                                <h1 className="text-primary text-xs font-bold tracking-wider">LIVE</h1>
                            </div>
                        </div>

                        <hr className="border-muted-text/40 " />

                        <div className="grid grid-cols-3 gap-3 ">
                            <MatchCard className="bg-danger border-muted-text rounded-xl p-3">
                                <div className="flex flex-col items-center text-center gap-1 text-xs">
                                    <h1 className="text-muted-text">CUTOFF DANGER</h1>
                                    <h1 className="text-[1.1rem] font-bold">{telemetry.in_danger.length} / {activePlayers.length}</h1>
                                    <h1 className="text-red-300">Facing Exit</h1>
                                </div>
                            </MatchCard>
                            <MatchCard className="bg-warning border-muted-text rounded-xl p-3">
                                {/* the below code was copied and pasted from the handwritten code above, it was not generated by ai: */}
                                <div className="flex flex-col items-center text-center gap-1 text-xs">
                                    <h1 className="text-muted-text">FASTEST SOLVE</h1>
                                    <h1 className="text-[#be883c]">{(telemetry.fastest_solve.total_time / 1000).toFixed(1)}</h1>
                                    <h1 className="text-muted-text">{telemetry.fastest_solve.username}</h1>
                                </div>
                            </MatchCard>
                            <MatchCard className="bg-primary/20 border-primary rounded-xl p-3">
                                <div className="flex flex-col items-center text-center gap-1 text-xs">
                                    <h1 className="text-secondary/30">YOUR PACE</h1>
                                    <h1 className="text-[1.1rem] font-bold">{telemetry.my_pace / 1000} s</h1>
                                    <h1 className="text-green-400/40">Rank {my_rank}</h1>
                                </div>
                            </MatchCard>

                        </div>

                        <MatchCard className="bg-[var(--match-box)] rounded-lg p-3">
                            <div className="flex flex-row items-center gap-2 text-xs">
                                <ChevronsRight />
                                <h1>Next: Round 3</h1>
                                <MatchCard className="bg-accent border-accent rounded-[10px] px-3 py-1 text-xs ml-auto text-secondary/60">
                                    SUDDEN DEATH
                                </MatchCard>
                            </div>

                        </MatchCard>

                    </MatchCard>
                </div>

            </div >
        </div >

    )
}


export default TournamentsMatchPage