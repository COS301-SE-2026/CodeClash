import "../styles/global.css"
import { Card } from "../../@/components/ui/card"
import {LogOut, Rocket, Timer, PlusIcon, UserRoundPlus} from "lucide-react"
import TournamentButton from "@/components/ui/TournamentButton"
import { Progress } from "@/components/ui/progress"
import { TournamentPlayer } from "@/components/ui/TournamentPlayer"
import FilterButton from "@/components/ui/FilterButton"
import { MatchCard } from "@/components/ui/MatchCard"


const TournamentsWaiting = () => {
    return(
        <div className="w-full min-h-screen overflow-hidden relative">
            <div className="flex flex-col max-w-[150rem] mx-auto">
                <Card className="bg-card border-[var(--button-tournament-secondary)] border-[0.5px] flex flex-col ">

                    <div className="inset-0 right-2 text-muted-text ml-4 -mt-2">#tournamentid</div>
                    
                    <div className="flex flex-row gap-4 w-full -mt-1">
                        <h1 className="font-font font-semibold text-xl ml-5">Tournament Title</h1>

                        <div className="gap-5 flex flex-row ml-auto mr-6">
                            <MatchCard className="w-[50%] h-[40%] hover:opacity-90 hover:scale-105 transition-transform duration-300">
                                <div className="flex flex-row gap-2">
                                    <LogOut size={25} className="text-muted-text ml-3 -mt-2.5"/>
                                    <h2 className="font-font font-semibold text-[1rem] text-muted-text -ml-3 px-3 -mt-2.5">Leave Waiting Room</h2>
                                </div>
                            </MatchCard>
                            <TournamentButton className="items-center h-auto justify-center px-2 py-2">
                                <div className="flex flex-row">
                                    <Rocket size={40} className="-ml-1"/>
                                    <div className="font-font font-semibold text-[1.8rem] ml-3">Start Match</div>
                                </div>
                            </TournamentButton>
                        </div>
                    </div>

                    <div className="flex flex-col -mt-1">
                        <div className="flex flex-row">
                            <div className="font-font font-semibold text-[1.2rem] text-primary ml-6">Room Capacity</div>
                            <div className="ml-auto font-semibold mr-6 text-[1.5rem]">4/8 Players</div>
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

                <TournamentButton className="mt-10 h-15 w-[30rem] mx-auto justify-center">
                    <h1 className="font-semibold my-auto mx-auto text-md">Click to Show You Are Ready!</h1>
                </TournamentButton>

                <div className="">

                </div>
            </div>
        </div>
    )
}

export default TournamentsWaiting;