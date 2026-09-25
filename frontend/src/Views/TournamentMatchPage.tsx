import { MatchCard } from "@/components/ui/MatchCard";
import "../styles/global.css"
import TournamentButton from "@/components/ui/TournamentButton";
import { Medal } from "lucide-react"

const TournamentsMatchPage = () => {
    return(
        <MatchCard className="rounded-[12px] w-[88%] h-[4rem] 
            shrink-0 m-10 flex items-center overflow-x-auto items-center justify-center">
            <div className="flex flex-row justify-between">
                <div className="flex flex-row">
                    <TournamentButton className="rounded-[10px] my-auto min-w-0 w-10 h-10 items-center -px-1 -py-4 ">
                        <Medal size={20} className="text-[var(--match-box)] mx-auto"/>
                    </TournamentButton>
                    <div className="flex flex-col ml-4">
                        <h1 className="font-semibold text-secondary text-[1.1rem]">Round 1/4</h1>
                        <div className="text-muted-text text-[0.7rem] -mt-0.5">5 Players Remaining</div>
                    </div>
                </div>

            </div>
        </MatchCard>
    )
}


export default TournamentsMatchPage