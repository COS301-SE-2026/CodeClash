import { TournamentCard } from "@/components/features/Tournaments/TournamentCard"
import FilterButton from "@/components/ui/FilterButton"
import { PlusIcon, Search } from "lucide-react"
import { useExtraLayout } from "src/extra-layout"
import { useTournament } from "src/ViewModels/Tournaments/TournamentViewModel"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { HostTournament } from "./HostTournament"

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
        <div className="w-full max-w-4xl min-h-screen overflow-hidden relative mx-auto px-4 py-4">
            <div className="w-full flex flex-col gap-8">
                <div className="flex flex-row items-start justify-between w-full gap-3">
                    <div className="flex flex-col w-full">
                        <h1 className="font-black text-primary-text text-xl leading-tight">Tournaments</h1>
                        <h2 className=" text-muted-text text-sm ">Join Live Battles or Clash With Friends</h2>
                    </div>
                    <Button
                        onClick={() => setHostTournament(true)}
                        className="btn btn-primary w-[26%] h-full"
                        variant={"default"}
                    >
                        <div className="flex flex-row w-full my-auto">
                            <PlusIcon size={30} className="ml-2 my-auto " />
                            <h2 className="font-font text-secondary font-semibold text-sm my-auto ml-1">Host Tournament</h2>
                        </div>
                    </Button>
                </div>

                <div className="justify-end max-w-4xl flex flex-row gap-4 h-9 cursor-pointer">
                    <FilterButton className="text-xs min-w-[3rem]">
                        Math
                    </FilterButton>
                    <FilterButton className="text-xs min-w-[6rem]">
                        Programming
                    </FilterButton>
                    <FilterButton className="text-xs min-w-[3rem]">
                        Both
                    </FilterButton>
                </div>


                <div className="overflow-y-auto w-full flex flex-col gap-9 items-center">
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
                            <div className="text-center text-danger text-sm">
                                <p>Nothing to show yet. Host your own tournament.</p>
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