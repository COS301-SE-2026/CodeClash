import "../styles/global.css"
import { Card } from "../../@/components/ui/card"
import {LogOut, Rocket, Timer} from "lucide-react"
import TournamentButton from "@/components/ui/TournamentButton"
import { Progress } from "@/components/ui/progress"
import { TournamentPlayer } from "@/components/ui/TournamentPlayer"


const TournamentsWaiting = () => {
    return(
        <div className="w-full max-h-screen">
            <div className="flex flex-col max-w-[150rem] mx-auto">
                <Card className="bg-card border-[var(--button-tournament-secondary)] border-[0.5px] flex flex-col ">

                    <div className="inset-0 right-2 text-muted-text ml-4 -mt-2">#tournamentid</div>
                    
                    <div className="flex flex-row w-full -mt-1">
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

                    <div className="flex flex-col mt-1">
                        <div className="flex flex-row">
                            <div className="font-font font-semibold text-[1.5rem] text-primary ml-5">Room Capacity</div>
                            <div className="ml-auto font-semibold mr-5 text-[1.5rem]">4/8 Players</div>
                        </div>
                        <Progress value={50} className="w-[98%] mx-auto mt-2"/>
                    </div>

                    <div className="flex flex-row">
                        <Timer size={50} className="text-muted-text ml-5 mt-3"/>
                        <div className="font-font font-semibold text-sm mt-6 ml-2">Time Until Start:</div>
                    </div>
                </Card>

                <div className="flex flex-row mt-10 ml-5">
                    <h1 className="font-semibold text-xl">Players:</h1>
                        {/* hidden until true: */}
                    <h2 className="text-lg ml-auto mr-5 mt-1">All Players Ready</h2>
                </div>

                <div className="grid grid-cols-3 ml-5 mt-6">
                    <TournamentPlayer/>
                </div>
            </div>
        </div>
    )
}

export default TournamentsWaiting;