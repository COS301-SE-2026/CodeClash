import "../styles/global.css"
import {LogOut, Rocket, Timer, PlusIcon, UserRoundPlus} from "lucide-react"
import TournamentButton from "@/components/ui/TournamentButton"
import { Progress } from "@/components/ui/progress"
import { TournamentPlayer } from "@/components/ui/TournamentPlayer"
import { MatchCard } from "@/components/ui/MatchCard"


const TournamentsWaiting = () => {
    return(
        <div className="w-full min-h-screen overflow-hidden relative">
            <div className="flex flex-col max-w-[150rem] mx-auto">
                <MatchCard className="flex flex-col overflow-x-auto">

                    <div className="inset-0 right-2 text-muted-text ml-4 -mt-2 text-[1rem]">#tournamentid</div>
                    
                    <div className="flex flex-row w-full -mt-1">
                        <h1 className="font-font font-semibold text-[2.5rem] ml-5 -mt-3">Tournament Title</h1>

                        <div className="gap-5 flex flex-row ml-auto mr-6 -mt-5">
                            <MatchCard className="w-[60%] h-[70%] hover:opacity-90 hover:scale-105 transition-transform duration-300">
                                <div className="flex flex-row gap-2">
                                    <LogOut size={20} className="text-muted-text ml-3 -mt-2.5"/>
                                    <h2 className="font-font font-semibold text-[0.9rem] text-muted-text -ml-3 px-3 -mt-2.5">Leave Waiting Room</h2>
                                </div>
                            </MatchCard>
                            <TournamentButton className="items-center h-[80%] min-w-40 justify-center px-2 rounded-sm">
                                <div className="flex flex-row mt-2.5">
                                    <Rocket size={25} className="ml-1 -mt-2"/>
                                    <div className="font-font font-semibold text-[1.1rem] ml-2 mr-1 -mt-2">Start Match</div>
                                </div>
                            </TournamentButton>
                        </div>
                    </div>

                    <div className="flex flex-col -mt-1">
                        <div className="flex flex-row">
                            <div className="font-font font-semibold text-[1rem] text-primary ml-6">Room Capacity</div>
                            <div className="ml-auto font-semibold mr-6 text-[0.9rem] -mb-3">4/8 Players</div>
                        </div>
                        <Progress value={50} className="w-[96%] mx-auto mt-2"/>
                    </div>

                    <div className="flex flex-row">
                        <Timer size={30} className="text-muted-text ml-5 -mt-3"/>
                        <div className="font-font font-semibold text-xs -mt-1 ml-2">Time Until Start:</div>
                    </div>
                </MatchCard>

                <div className="flex flex-row mt-10 ml-5">
                    <h1 className="font-semibold text-xl">Players:</h1>
                        {/* hidden until true: */}
                    <h2 className="text-lg ml-auto mr-5 mt-1">All Players Ready</h2>
                </div>

                <div className="grid grid-cols-3 ml-5 mt-6 mr-5 gap-5">
                    <TournamentPlayer/>
                    <TournamentPlayer/>
                    <TournamentPlayer/>
                    <TournamentPlayer/>
                    
                    <MatchCard className="border-dashed flex flex-row text-muted-text text-[1.1rem] justify-center hover:opacity-90 hover:scale-105 transform-transition duration-300">
                        <UserRoundPlus size={30} className="ml-3 "/>
                        <h1 className="mr-3 mt-1">Invite Friend</h1>
                    </MatchCard>
                </div>

                <TournamentButton className="mt-15 mb-15 h-auto w-auto mx-auto justify-center rounded-sm px-2">
                    <h1 className="font-semibold my-auto mx-auto text-sm">Click to Show You Are Ready!</h1>
                </TournamentButton>

                <div className="">

                </div>
            </div>
        </div>
    )
}

export default TournamentsWaiting;