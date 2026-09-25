import { MatchCard } from "@/components/ui/MatchCard";
import "../styles/global.css"
import TournamentButton from "@/components/ui/TournamentButton";
import { Medal } from "lucide-react"

const TournamentsMatchPage = () => {
    return(
        <MatchCard className="rounded-[12px] w-[88%] h-[4rem] 
            shrink-0 mb-10 mt-10 ml-10 mr-10 flex items-center overflow-x-auto">
            <div className="flex flex-row">
                <div className="flex flex-row">
                    <TournamentButton className="rounded-[10px] my-auto min-w-0 w-12 h-12 items-center -px-1 -py-4 -ml-3 -mt-1 ">
                        <Medal className="text-[var(--match-box)] mx-auto"/>
                    </TournamentButton>
                    <div className="flex flex-col">
                        
                    </div>
                </div>

            </div>
        </MatchCard>
    )
}


export default TournamentsMatchPage