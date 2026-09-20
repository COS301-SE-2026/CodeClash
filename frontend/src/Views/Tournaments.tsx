//This is a wow factor - i am just calling the coming soon component so the page isnt blank when clicked from dashboard
import {MathTournamentCard, ProgrammingTournamentCard} from "@/components/ui/TournamentCard"
import TournamentButton from "@/components/ui/TournamentButton"
import FilterButton from "@/components/ui/FilterButton"
import "../styles/global.css"
import {PlusIcon, Search} from "lucide-react"
import { Navigate, useNavigate } from "react-router-dom"
import Popup from "./Popup"
// import { DefaultTournamentsModel } from "src/Models/TournamentsModel"
// import type { TournamentsModel } from "src/Models/TournamentsModel"

// interface TournamentProps{
//     tournaments: TournamentsModel
// }

const Tournaments = (
    // {tournaments = DefaultTournamentsModel} : TournamentProps
) => {
    const nav = useNavigate();
    
    return (
        <div className="w-full max-h-screen">
            <div className="w-full flex flex-col">
                <div className="flex grid grid-cols-2 h-full w-full">
                    <h1 className="font-font font-semibold text-6xl ml-20 mt-10">Tournaments</h1>
                    <TournamentButton className="w-md h-17 mt-6 ml-[40%]">
                        <div className="grid grid-cols-2 w-full">
                            <PlusIcon size={60} className="mb-4 ml-3"/>
                            <h2 className="font-font font-semibold text-[40px] mb-5 -ml-30">Host Tournament</h2>
                        </div>
                    </TournamentButton>
                    <h2 className="font-font text-sm ml-20 w-full mt-7">Join Tournaments to Compete With Up to 30 Players! Invite Friends to Join in on the Fun!</h2>
                </div>

                <div className="flex grid grid-cols-2 w-full mt-10">
                    
                    <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 h-14 ml-20 mb-15 w-[68%]">
                        <Search size={18} className="text-muted-text shrink-0"/>
                    </div>

                    <div className=" flex flex-row gap-10 ml-[40%] mb-15">
                        <FilterButton className="">
                            <h1 className="text-primary font-semibold text-[90%]">Math</h1>
                        </FilterButton>
                        <FilterButton className="w-40">
                            <h1 className="text-primary font-semibold text-[90%]">Programming</h1>
                        </FilterButton>
                        <FilterButton>
                            <h1 className="text-primary font-semibold text-[90%]">Both</h1>
                        </FilterButton>
                    </div>
                </div>

                <div className="overflow-y-auto w-full flex flex-col gap-9">
                    <MathTournamentCard/>
                    <ProgrammingTournamentCard/>
                    <MathTournamentCard/>
                </div>
            </div> 
        </div>
    )
}

export default Tournaments;