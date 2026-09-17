//This is a wow factor - i am just calling the coming soon component so the page isnt blank when clicked from dashboard
import {MathTournamentCard} from "@/components/ui/TournamentCard"
import TournamentButton from "@/components/ui/TournamentButton"
import FilterButton from "@/components/ui/FilterButton"
// import ComingSoon from "@/components/ui/ComingSoon";
import "../styles/global.css"
import {PlusIcon} from "lucide-react"

const Tournaments = () => {
    return (
        <div className="w-full min-h-flex">
            <div className="h-full w-full flex grid grid-rows-3">
                <div className="flex grid grid-cols-2 h-full w-full">
                    <h1 className="font-font font-semibold text-6xl ml-6 mt-6">Tournaments</h1>
                    <TournamentButton className="w-lg h-[50%] mt-3 ml-[40%]">
                        <div className="grid grid-cols-2 w-full">
                            <PlusIcon size={60} className="mb-4 ml-3 -mt-3.5"/>
                            <h2 className="font-font font-semibold text-[40px] mb-5 -ml-30 -mt-3">Host Tournament</h2>
                        </div>
                    </TournamentButton>
                    <h2 className="font-font text-sm -mt-12 ml-6">Join Tournaments to Compete With Up to 30 Players! Invite Friends to Join in on the Fun!</h2>
                </div>

                <div className="flex grid grid-cols-2 w-full">
                    <div className="w-[110%]">

                    </div>

                    <div className="mt-1 flex grid grid-cols-3 w-full">
                        <FilterButton>Math</FilterButton>
                        <FilterButton>Programming</FilterButton>
                        <FilterButton>Both</FilterButton>
                    </div>
                </div>

                <div className="overflow-y-auto -mt-10">
                    <MathTournamentCard/>
                </div>

            </div> 
        </div>
    )
}

export default Tournaments;