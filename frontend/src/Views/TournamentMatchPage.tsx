import { MatchCard } from "@/components/ui/MatchCard";
import "../styles/global.css"
import TournamentButton from "@/components/ui/TournamentButton";
import { Trophy, Lock, ChevronsRight, Signal } from "lucide-react"
import { TimerCard } from "@/components/ui/MatchBox";
import { Question } from "@/components/features/question";
import { MatchBox } from "@/components/ui/MatchBox";
import { MultipleChoice } from "@/components/ui/MultipleChoice";
import { LiveTournamentPlayer } from "@/components/ui/LiveTournamentPlayer";

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

            <div className="flex flex-row">
                <MatchCard className="h-full ml-4">
                    <div className="flex flex-col">

                        <Question
                            className={`border-[var(--card-tournaments)]`}
                            difficulty={"MEDIUM"}
                            title={"Binary Search Floor Index"}
                            description={'Given a sorted array of distinct integers and a target value, find the largest index i such that arr[i] < target. What is the guaranteed worst execution time?'}
                            number={1}
                        />

                        <MatchBox className="w-full min-h-40 h-50 rounded-lg bg-[var(--match-box)]"></MatchBox>


                        <div className="flex flex-col">
                            <MultipleChoice letter="A" option="answer" selected={false}/>
                            <MultipleChoice letter="B" option="answer" selected={true}/>
                            <MultipleChoice letter="C" option="answer" selected={false}/>
                            <MultipleChoice letter="D" option="answer" selected={false}/>
                        </div>

                        <hr className="text-muted-text"></hr>

                        <div className="flex flex-row">
                            <div className="flex flex-row">
                                <Lock className="text-muted-text"/>
                                <p className="text-muted-text">Answers lock automatically at round expiry</p>
                            </div>

                            <MatchCard className="bg-[#0b0509] text-muted-text">RESET</MatchCard>
                            <TournamentButton>
                                <div className="flex flex-row">
                                    <h1>Submit Answer</h1>
                                    <ChevronsRight/>
                                </div>
                            </TournamentButton>

                        </div>


                    </div>
                </MatchCard>

                <div className="flex flex-col">
                    <MatchCard>
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-row">
                                <Signal className="text-muted-text"/>
                                <h1>Live Standings</h1>
                            </div>
                            <MatchCard className="flex bg-[var(--multiple-choice-box)] text-muted-text">Round 1</MatchCard>
                        </div>

                        <hr className="text-muted-text"/>

                        <div className="flex flex-col">
                            <LiveTournamentPlayer/>
                            <LiveTournamentPlayer/>
                            <LiveTournamentPlayer/>
                            <LiveTournamentPlayer/>
                            <LiveTournamentPlayer/>

                            <hr className="border-dotted"/>

                            <div className="rounded-[20px] flex flex-row bg-red-400 border border-red-200">
                                <div className="rounded-full bg-red-800 size-2"></div>
                                <h1 className="text-red-200"></h1>

                                <div className="text-muted-text ml-auto">
                                    6 below line
                                </div>
                            </div>

                        </div>


                    </MatchCard>


                    <MatchCard>

                    </MatchCard>
                </div>
                
            </div>
        </div>

    )
}


export default TournamentsMatchPage