import "../styles/global.css"
import { Card } from "../../@/components/ui/card"
import {LogOut, Rocket} from "lucide-react"
import TournamentButton from "@/components/ui/TournamentButton"


const TournamentsWaiting = () => {
    return(
        <div className="w-full max-h-screen">
            <div className="flex flex-col max-w-[150rem] mx-auto">
                <Card className="bg-card border-[var(--button-tournament-secondary)] border-[0.5px] flex flex-col ">
                    
                    <div className="flex flex-row w-full">
                        <h1 className="font-font font-semibold text-2xl ml-5">Tournament Title</h1>

                        <div className="gap-8 grid grid-cols-2 ml-auto mr-5">
                            <Card className="bg-card border-[var(--button-tournament-secondary)] border-[0.5px]">
                                <div className="flex flex-row gap-2">
                                    <LogOut size={35} className="text-muted-text ml-3"/>
                                    <h2 className="font-font font-semibold text-[1.7rem] text-muted-text -mt-1 -ml-3 px-3">Leave Waiting Room</h2>
                                </div>
                            </Card>
                            <TournamentButton className="items-center h-21.5">
                                <div className="flex flex-row">
                                    <Rocket size={40} className="-ml-1"/>
                                    <div className="font-font font-semibold text-[1.8rem] ml-3">Start Match</div>
                                </div>
                            </TournamentButton>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default TournamentsWaiting;