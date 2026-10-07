import { TournamentCard } from "@/components/features/Tournaments/TournamentCard"
import { PlusIcon, Search } from "lucide-react"
import { useExtraLayout } from "src/extra-layout"
import { useTournament } from "src/ViewModels/Tournaments/TournamentViewModel"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { HostTournament } from "./HostTournament"
import Starfield from "@/components/ui/animations/Starfield"

const Tournaments = () => {
    const { tournaments, createTournament, joinTournamnet,leaveTournament } = useTournament();
    const [hostTournament, setHostTournament] = useState(false);

    useExtraLayout(
        // the code below was handwritten and used to be below this part of the code, i just copied and pasted it here to move it
        <div className="relative w-full">
            <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5">
                <Search size={18} className="text-muted-text shrink-0" />
            </div>
        </div>
    )

    return (
        <div className="relative w-full min-h-screen overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/75 to-background" />
            <Starfield />
            
            <div className="relative z-10 w-full mx-auto px-6 py-6 flex flex-col gap-8">
                <div className="flex flex-row items-center justify-between w-full gap-3">
                    <div className="flex flex-col w-full">
                        <h1 className="font-black text-primary-text text-xl leading-tight">Tournaments</h1>
                        <h2 className=" text-muted-text text-sm ">Join Live Battles or Clash With Friends</h2>
                    </div>
                    <Button
                        onClick={() => setHostTournament(true)}
                        className="btn btn-primary shrink-0"
                        variant={"default"}
                        type="button"
                    >
                        <PlusIcon size={30} />
                        Host Tournament
                    </Button>
                </div>

                <div className="w-full flex flex-col gap-9 items-center">
                    {tournaments.length > 0 && tournaments.map((tournament) => {
                        return (
                            <TournamentCard
                                key={tournament.tournament_id}
                                id={tournament.tournament_id}
                                match_mode={tournament.tournament_mode}
                                title={tournament.title}
                                min_players={tournament.min_players}
                                player_count={tournament.players.length}
                                onJoin={joinTournamnet}
                                onLeave={leaveTournament}
                                host_player={tournament.host}
                                players={tournament.players}
                            />
                        )
                    })}

                    {tournaments.length <= 0 &&
                        (
                            <div className="card-elevated p-8 text-center">
                                <p className="text-sm font-bold text-primary-text mb-1">Nothing to show yet</p>
                                <p className="text-xsm text-muted-text">Host your own tournament to get started.</p>
                            </div>
                        )
                    }
                </div>
            </div>

            {
                hostTournament && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                        <HostTournament
                            Cancel={() => { setHostTournament(false) }}
                            Create={createTournament}
                        />
                    </div>
                )
            }
        </div>



    )
}

export default Tournaments;