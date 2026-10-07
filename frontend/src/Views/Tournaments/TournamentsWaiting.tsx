import { LogOut, Rocket } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { TournamentPlayer } from "@/components/features/Tournaments/TournamentPlayer"
import { MatchCard } from "@/components/features/Match/MatchCard"
import { useNavigate } from "react-router-dom"
import { useTournamentLobby } from "src/ViewModels/Tournaments/TournamentLobby"
import { Button } from "@/components/ui/button"

import Starfield from "@/components/ui/animations/Starfield"

const TournamentsWaiting = () => {

    const nav = useNavigate();
    const { tournament, is_host, players, start } = useTournamentLobby();

    if (!tournament) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center p-6">
                <MatchCard className="w-full max-w-md p-8 text-center text-secondary/60 font-semibold text-xsm">
                    Error Viewing Tournament Lobby.
                </MatchCard>
            </div>
        )
    }

    const can_start = players.length >= tournament.min_players

    return (
        <div className="relative w-full min-h-screen overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/75 to-background" />
            <Starfield />

            <div className="relative z-10 flex flex-col w-full max-w-[1400px] mx-auto px-6 py-6 gap-6">
                <MatchCard className="flex flex-col gap-5 p-6">

                    <div className="flex flex-row flex-wrap items-center justify-between gap-4 w-full">
                        <h1 className="text-1 font-black text-secondary leading-tight">{tournament.title}</h1>

                        <div className="flex flex-row items-center gap-4">
                            <button onClick={() => nav('/tournaments')} className="btn btn-ghost text-secondary whitespace-nowrap" type="button">
                                <LogOut size={20} />
                                Leave Waiting Room
                            </button>

                            {is_host() &&
                                <Button
                                    className="btn btn-primary h-11 min-w-40"
                                    variant={"default"}
                                    onClick={start}
                                    disabled={!can_start}
                                >
                                    <Rocket size={22} />
                                    Start Match
                                </Button>}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex flex-row items-baseline justify-between">
                            <div className="text-xsm font-bold text-primary uppercase tracking-widest">Room Capacity</div>
                            <div className="text-xsm font-semibold text-secondary">{players.length}/{tournament.min_players} Players</div>
                        </div>
                        <Progress value={Math.min(100, (players.length / tournament.min_players) * 100)} height={2.5} className="w-full" />

                        {is_host() && !can_start && (
                            <p className="text-xsm text-secondary/60">
                                {tournament.min_players - players.length} more player(s) needed to start
                            </p>
                        )}
                    </div>
                </MatchCard>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {
                        players.map((player) => {
                            return (
                                <TournamentPlayer key={player.id} player={player} />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default TournamentsWaiting;