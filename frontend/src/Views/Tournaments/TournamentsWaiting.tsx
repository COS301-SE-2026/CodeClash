import { LogOut, Rocket, Timer, UserRoundPlus } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { TournamentPlayer } from "@/components/features/Tournaments/TournamentPlayer"
import { MatchCard } from "@/components/features/Match/MatchCard"
import { useNavigate } from "react-router-dom"
import { useTournamentLobby } from "src/ViewModels/Tournaments/TournamentLobby"
import { Button } from "@/components/ui/button"
import { useTournament } from "src/ViewModels/Tournaments/TournamentViewModel"

const TournamentsWaiting = () => {

    const nav = useNavigate();
    const { tournament, is_host, players, start } = useTournamentLobby();
    const { starts_in } = useTournament();

    if (!tournament) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center p-6">
                <MatchCard className="w-full max-w-md p-8 text-center text-muted-text font-semibold text.[1.1rem]">
                    Error Viewing Tournament Lobby.
                </MatchCard>
            </div>
        )
    }

    const can_start = players.length >= tournament.min_players

    return (
        <div className="w-full min-h-screen overflow-hidden relative px-5 py-6">
            <div className="flex flex-col max-w-[150rem] mx-auto gap-6">
                <MatchCard className="flex flex-col overflow-x-auto gap-5 p-6">

                    <div className="flex flex-row flex-wrap items-center justify-between gap-4 w-full">
                        <h1 className="font-font font-semibold text-[2.5rem] leading-tight">{tournament.title}</h1>

                        <div className="flex flex-row items-center gap-4">
                            <MatchCard className="h-11 px-4 flex items-center rounded-xl hover:opacity-90 hover:scale-105 transition-transform duration-300">
                                <button onClick={() => nav('/tournaments')} className="flex flex-row gap-2 items-center cursor-pointer">
                                    <LogOut size={20} className="text-muted-text" />
                                    <h2 className="font-font font-semibold text-[0.9rem] text-muted-text whitespace-nowrap">Leave Waiting Room</h2>
                                </button>
                            </MatchCard>
                            {is_host() &&
                                <Button
                                    className="h-11 min-w-40 px-5 flex items-center justify-center rounded-xl"
                                    variant={"default"}
                                    onClick={start}
                                    disabled={!can_start}
                                >
                                    <div className="flex flex-row items-center gap-2">
                                        <Rocket size={22} />
                                        <div className="font-font font-semibold text-[1.1rem]">
                                            Start Match
                                        </div>
                                    </div>
                                </Button>}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex flex-row items-baseline justify-between">
                            <div className="font-font font-semibold text-[1rem] text-primary uppercase tracking-widest">Room Capacity</div>
                            <div className="font-semibold text-[0.9rem] text-primary-text">{players.length}/{tournament.min_players} Players</div>
                        </div>
                        <Progress value={(players.length / tournament.min_players) * 100} height={2.5} className="w-full" />
                    </div>

                    <div className="flex flex-row items-center gap-2">
                        <Timer size={30} className="text-muted-text" />
                        <div className="font-font font-semibold text-xs text-muted-text">Starts in {starts_in(new Date(tournament.start_date))}</div>
                    </div>
                </MatchCard>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {
                        tournament.players.map((player) => {
                            return (
                                <TournamentPlayer player={player} />
                            )
                        })
                    }
                    <MatchCard className="border-dashed flex flex-row text-muted-text text-[1.1rem] items-center justify-center hover:opacity-90 hover:scale-105 transform-transition duration-300">
                        <UserRoundPlus size={28} />
                        <h1 >Invite Friend</h1>
                    </MatchCard>
                </div>
            </div>
        </div>
    )
}

export default TournamentsWaiting;