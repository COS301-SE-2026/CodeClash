import { MatchCard } from "@/components/ui/MatchCard";
import "../styles/global.css"
import TournamentButton from "@/components/ui/TournamentButton";
import { Medal } from "lucide-react"
import { TimerCard } from "@/components/ui/MatchBox";

const TournamentsMatchPage = () => {
    return(
        <MatchCard className="rounded-[12px] w-[88%] h-[4rem] 
            shrink-0 m-10 flex items-center overflow-x-auto items-center justify-center">
            <div className="flex flex-row justify-between w-full">
                <div className="flex flex-row ml-2.5">
                    <TournamentButton className="rounded-[10px] my-auto min-w-0 w-10 h-10 items-center -px-1 -py-4 ">
                        <Medal size={20} className="text-[var(--match-box)] mx-auto"/>
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
    )
}


export default TournamentsMatchPage