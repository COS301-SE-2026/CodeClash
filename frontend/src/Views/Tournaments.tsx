//This is a wow factor - i am just calling the coming soon component so the page isnt blank when clicked from dashboard
import {MathTournamentCard, ProgrammingTournamentCard} from "@/components/ui/TournamentCard"
import TournamentButton from "@/components/ui/TournamentButton"
import FilterButton from "@/components/ui/FilterButton"
import "../styles/global.css"
import {PlusIcon, Search} from "lucide-react"
import { Navigate, useNavigate } from "react-router-dom"
import Popup from "./Popup"
import { useExtraLayout } from "src/extra-layout"
// import { DefaultTournamentsModel } from "src/Models/TournamentsModel"
// import type { TournamentsModel } from "src/Models/TournamentsModel"

// interface TournamentProps{
//     tournaments: TournamentsModel
// }

const Tournaments = (
    // {tournaments = DefaultTournamentsModel} : TournamentProps
) => {
    const nav = useNavigate();

    useExtraLayout(
        // the code below was handwritten and used to be below this part of the code, i just copied and pasted it here to move it
        <div className="relative w-full">
            <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5">
                <Search size={18} className="text-muted-text shrink-0"/>
            </div>
        </div>
    )
    
    return (
        <div className="w-full min-h-screen overflow-hidden">
            <div className="w-full flex flex-col">
                <div className="flex grid grid-cols-2 h-full w-full">
                    <h1 className="font-black text-primary-text text-xl ml-4 mt-1">Tournaments</h1>
                    <TournamentButton className="w-3xs h-3xs mb-3 mt-3 mr-auto ml-20">
                        <div className="flex flex-row w-full">
                            <PlusIcon size={30} className="ml-4 my-auto mt-2"/>
                            <h2 className="font-font font-semibold text-sm ml-5 my-auto mt-2">Host Tournament</h2>
                        </div>
                    </TournamentButton>
                    <h2 className=" text-primary-text text-sm ml-4 -mt-1 w-full ">Join Live Battles or Clash With Friends</h2>
                </div>

                <div className="flex grid grid-cols-2 w-full mt-10">
                

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