import { MatchCard } from "@/components/ui/MatchCard";
import "../styles/global.css"
import TournamentButton from "@/components/ui/TournamentButton";
import { Trophy, Lock, ChevronsRight, Signal, Zap } from "lucide-react"
import { TimerCard } from "@/components/ui/MatchBox";
import { Question } from "@/components/features/question";
import { MatchBox } from "@/components/ui/MatchBox";
import { MultipleChoice } from "@/components/ui/MultipleChoice";
import { LiveTournamentPlayer } from "@/components/ui/LiveTournamentPlayer";
import { Progress } from "@/components/ui/progress";

const TournamentsMatchPage = () => {
    return(
        <div className="m-6 ml-4 min-h-screen">
            <MatchCard className="rounded-[12px] w-full h-[4rem] 
                shrink-0 flex items-center overflow-x-auto items-center justify-center mb-6">
                <div className="flex flex-row justify-between w-full">
                    <div className="flex flex-row ml-2.5">
                        <TournamentButton className="rounded-[10px] my-auto min-w-0 w-10 h-10 items-center -px-1 -py-4 ">
                            <Trophy size={20} className="text-[var(--match-box)] mx-auto"/>
                        </TournamentButton>
                        <div className="flex flex-col ml-4">
                            <h1 className="font-semibold text-secondary text-[1.1rem] mt-1">Round 1/4</h1>
                            <div className="text-muted-text text-[0.7rem] -mt-0.5">5 Players Remaining</div>
                        </div>
                    </div>

                    <TimerCard className="mr-2.5">
                        <span>
                        00:00
                        </span>
                    </TimerCard>


                </div>
            </MatchCard>

            <div className="flex flex-col lg:flex-row items-start gap-4">
                <MatchCard className="flex-1 w-full lg:w-2/3 p-5 rounded-2xl ml-4">
                    <div className="flex flex-col">

                        <Question
                            className={`border-[var(--card-tournaments)]`}
                            difficulty={"MEDIUM"}
                            title={"Binary Search Floor Index"}
                            description={'Given a sorted array of distinct integers and a target value, find the largest index i such that arr[i] < target. What is the guaranteed worst execution time?'}
                            number={1}
                        />

                        <MatchBox className="w-full min-h-40 h-50 rounded-lg bg-[var(--match-box)] mb-4"></MatchBox>


                        <div className="flex flex-col gap-3 mb-4">
                            <MultipleChoice letter="A" option="answer" selected={false}/>
                            <MultipleChoice letter="B" option="answer" selected={true}/>
                            <MultipleChoice letter="C" option="answer" selected={false}/>
                            <MultipleChoice letter="D" option="answer" selected={false}/>
                        </div>

                        <hr className="border-muted-text/40"></hr>

                        <div className="flex flex-row items-center justify-between gap-4 mt-4 flex-wrap">
                            <div className="flex flex-row items-center gap-2">
                                <Lock size={18} className="text-muted-text"/>
                                <p className="text-muted-text text-xs">Answers lock automatically at round expiry</p>
                            </div>

                            <div className="flex flex-row items-center gap-3">
                                <MatchCard className="bg-[#0b0509] text-muted-text px-4 py-2 rounded-lg">RESET</MatchCard>
                                <TournamentButton className="px-4 py-2 rounded-lg">
                                    <div className="flex flex-row items-center gap-2">
                                        <h1>Submit Answer</h1>
                                        <ChevronsRight size={30}/>
                                    </div>
                                </TournamentButton>
                            </div>

                        </div>


                    </div>
                </MatchCard>

                <div className="flex flex-col gap-4 w-full lg:w-[380px] shrink-0">
                    <MatchCard className="flex flex-col gap-3 p-4 rounded-2xl">
                        <div className="flex flex-row items-center justify-between">
                            <div className="flex flex-row items-center gap-2">
                                <Signal size={18} className="text-muted-text"/>
                                <h1>Live Standings</h1>
                            </div>
                            <MatchCard className="flex bg-[var(--multiple-choice-box)] text-muted-text px-3 py-1 rounded-full text-xs">Round 1</MatchCard>
                        </div>

                        <hr className="border-muted-text/40"/>

                        <div className="flex flex-col gap-2">
                            <LiveTournamentPlayer/>
                            <LiveTournamentPlayer/>
                            <LiveTournamentPlayer/>
                            <LiveTournamentPlayer/>
                            <LiveTournamentPlayer/>

                            <hr className="border-dotted border-muted-text/40 my-1"/>

                            <div className="rounded-lg flex flex-row items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-400/20">
                                <div className="rounded-full bg-red-800 size-2 shrink-0"></div>
                                <h1 className="text-red-200 text-xs">Elimination Zone</h1>

                                <div className="text-muted-text ml-auto text-xs">
                                    6 below line
                                </div>
                            </div>

                        </div>


                    </MatchCard>


                    <MatchCard className="flex flex-col gap-3 p-4 rounded-2xl">
                        <div className="flex flex-row items-center gap-2">
                            <Zap size={18}/>
                            <h1 className="">Round Telemetry</h1>
                            <div className="flex items-center gap-1 bg-primary/20 border border-[var(--primary)] border-[0.05rem] rounded-[10px] px-2 py-0.5 ml-auto">
                                <div className="bg-primary size-1 rounded-full"></div>
                                <h1 className="text-primary text-xs">LIVE</h1>
                            </div>
                        </div>

                        <hr className="border-muted-text/40"/>

                        <div className="flex flex-col gap-2">
                            <div className="flex flex-row justify-between text-xs">
                                <h1 className="text-muted-text">PACING & CUTOFF</h1>
                                <h1 className="text-green-400">Avg is 5.4s to qualify</h1>
                            </div>

                            <Progress 
                                bg={"var(--match-box)" }
                                border={"var(--button-tournament-secondary" }
                                from={"#75D624" }
                                via={"#EDD745"} 
                                to={"#DB1818"}
                                glow={"#DB1818"}
                                height={2}
                                value={60}
                                className="w-full"
                            />

                            <div className="flex flex-row justify-between text-xs">
                                <h1 className="text-muted-text">0.0s (Fastest)</h1>
                                <h1 className="text-green-400">Safe Zone (≤ 7.2s)</h1>
                                <h1 className="text-red-200">Cutoff</h1>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <MatchCard className="bg-[#413638] border-secondary rounded-xl p-3">
                                <div className="flex flex-col items-center text-center gap-1 text-xs">
                                    <h1 className="text-muted-text">CUTOFF DANGER</h1>
                                    <h1>6 / 14</h1>
                                    <h1 className="text-red-300">Facing Exit</h1>
                                </div>
                            </MatchCard>
                            <MatchCard className="bg-[#413638] border-secondary rounded-xl p-3">
                                {/* the below code was copied and pasted from the handwritten code above, it was not generated by ai: */}
                                <div className="flex flex-col items-center text-center gap-1">
                                    <h1>FASTEST SOLVE</h1>
                                    <h1>4.2s</h1>
                                    <h1>User</h1>
                                </div>
                            </MatchCard>
                            <MatchCard className="bg-primary/20 border-primary">
                                <h1>YOUR PACE</h1>
                                <h1>6.1 s</h1>
                                <h1>Rank</h1>
                            </MatchCard>

                        </div>

                        <MatchCard className="bg-[var(--match-box)]">
                            <div className="flex flex-row">
                                <ChevronsRight/>
                                <h1>Next: Round 3</h1>
                                <MatchCard className="bg-[#280640] border-[#34114e]">
                                    SUDDEN DEATH
                                </MatchCard>
                            </div>

                        </MatchCard>

                    </MatchCard>
                </div>
                
            </div>
        </div>

    )
}


export default TournamentsMatchPage