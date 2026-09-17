//This is a wow factor - i am just calling the coming soon component so the page isnt blank when clicked from dashboard
import {MathTournamentCard} from "@/components/ui/TournamentCard"
import TournamentButton from "@/components/ui/TournamentButton"
import FilterButton from "@/components/ui/FilterButton"
// import ComingSoon from "@/components/ui/ComingSoon";
import "../styles/global.css"
import {PlusIcon, Search} from "lucide-react"

const Tournaments = () => {
    return (
        <div className="w-full min-h-flex">
            <div className="h-full w-full flex grid grid-rows-3">
                <div className="flex grid grid-cols-2 h-full w-full">
                    <h1 className="font-font font-semibold text-6xl ml-6 mt-6">Tournaments</h1>
                    <TournamentButton className="w-md h-[50%] mt-3 ml-[40%]">
                        <div className="grid grid-cols-2 w-full">
                            <PlusIcon size={60} className="mb-4 ml-3 -mt-5.5"/>
                            <h2 className="font-font font-semibold text-[40px] mb-5 -ml-30 -mt-5">Host Tournament</h2>
                        </div>
                    </TournamentButton>
                    <h2 className="font-font text-sm -mt-5 ml-6 w-full">Join Tournaments to Compete With Up to 30 Players! Invite Friends to Join in on the Fun!</h2>
                </div>

                <div className="flex grid grid-cols-2 w-full">
                    <div className="w-[110%]">

                    </div>

                    <div className="mt-8 flex flex-row gap-10 w-full justify-end -ml-4">
                        <FilterButton>
                            <h1 className="text-primary font-semibold text-sm">Math</h1>
                        </FilterButton>
                        <FilterButton>
                            <h1 className="text-primary font-semibold text-sm">Programming</h1>
                        </FilterButton>
                        <FilterButton>
                            <h1 className="text-primary font-semibold text-sm">Both</h1>
                        </FilterButton>
                    </div>
                </div>

                <div className="overflow-y-auto -mt-10 w-full">
                    <MathTournamentCard/>
                </div>
            </div> 
        </div>
    )
}

export default Tournaments;