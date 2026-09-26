import { LogOut, Rocket, Timer, UserRoundPlus } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { TournamentPlayer } from "@/components/features/Tournaments/TournamentPlayer"
import { MatchCard } from "@/components/ui/MatchCard"
import { useNavigate } from "react-router-dom"
import { useTournamentLobby } from "src/ViewModels/Tournaments/TournamentLobby"
import { Button } from "@/components/ui/button"
import { useTournament } from "src/ViewModels/Tournaments/TournamentViewModel"

const TournamentsWaiting = () => {

    const nav = useNavigate();
    const { tournament, is_host, players } = useTournamentLobby();
    const { starts_in } = useTournament();


    if (!tournament) {
        return (
            <div>
                Error Viewing Tournament Lobby.
            </div>
        )
    }

    return (
        <div className="w-full min-h-screen overflow-hidden relative">
            <div className="flex flex-col max-w-[150rem] mx-auto">
                <MatchCard className="flex flex-col overflow-x-auto">

                    <div className="flex flex-row w-full -mt-1">
                        <h1 className="font-font font-semibold text-[2.5rem] ml-5 -mt-3">{tournament.title}</h1>

                        <div className="gap-5 flex flex-row ml-auto mr-6 -mt-5">
                            <MatchCard className="w-[60%] h-[70%] hover:opacity-90 hover:scale-105 transition-transform duration-300">
                                <button onClick={() => nav('/tournaments')} className="flex flex-row gap-2">
                                    <LogOut size={20} className="text-muted-text ml-3 -mt-2.5" />
                                    <h2 className="font-font font-semibold text-[0.9rem] text-muted-text -ml-3 px-3 -mt-2.5">Leave Waiting Room</h2>
                                </button>
                            </MatchCard>
                            {is_host() && <Button className="items-center h-[80%] min-w-40 justify-center px-2 rounded-sm"
                                variant={"default"}
                            >
                                <div className="flex flex-row mt-2.5">
                                    <Rocket size={25} className="ml-1 -mt-2" />
                                    <div className="font-font font-semibold text-[1.1rem] ml-2 mr-1 -mt-2">
                                        Start Match
                                    </div>
                                </div>
                            </Button>}
                        </div>
                    </div>

                    <div className="flex flex-col -mt-1">
                        <div className="flex flex-row">
                            <div className="font-font font-semibold text-[1rem] text-primary ml-6">Room Capacity</div>
                            <div className="ml-auto font-semibold mr-6 text-[0.9rem] -mb-3">{players.length}/{tournament.min_players} Players</div>
                        </div>
                        <Progress value={(players.length / tournament.min_players) * 100} height={2.5} className="w-[96%] mx-auto mt-2" />
                    </div>

                    <div className="flex flex-row">
                        <Timer size={30} className="text-muted-text ml-5 -mt-3" />
                        <div className="font-font font-semibold text-xs -mt-1 ml-2">Starts in {starts_in(new Date(tournament.start_date))}</div>
                    </div>
                </MatchCard>

                <div className="grid grid-cols-3 ml-5 mt-6 mr-5 gap-5">
                    {
                        tournament.players.map((player) => {
                            return (
                                <TournamentPlayer player={player} />
                            )
                        })
                    }
                    <MatchCard className="border-dashed flex flex-row text-muted-text text-[1.1rem] justify-center hover:opacity-90 hover:scale-105 transform-transition duration-300">
                        <UserRoundPlus size={30} className="ml-3 " />
                        <h1 className="mr-3 mt-1">Invite Friend</h1>
                    </MatchCard>
                </div>
            </div>
        </div>
    )
}

export default TournamentsWaiting;