import { MatchCard } from "@/components/ui/MatchCard";
import "../styles/global.css"
import TournamentButton from "@/components/ui/TournamentButton";
import { Trophy } from "lucide-react"
import { TimerCard } from "@/components/ui/MatchBox";

const TournamentsMatchPage = () => {
    return(
        <div className="m-6 ml-4 min-h-screen border">
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

            <div className="flex flex-row border">
                <div className="flex flex-col">
                    <MatchCard className="h-full ml-4">
                        <div className="flex flex-row">
                            <MatchCard className="rounded-10 min-w-[1rem] bg-[#380f54]">MEDIUM</MatchCard>
                            <div className="text-muted-text text-[10px]">Question 1 of 4</div>
                        </div>
                    </MatchCard>

                
                </div>
            </div>
        </div>

    )
}


export default TournamentsMatchPage