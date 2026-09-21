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
        <div className="w-full max-w-4xl min-h-screen overflow-hidden">
            <div className="w-full flex flex-col">
                <div className="flex grid grid-cols-2 h-full w-full">
                    <h1 className="font-black text-primary-text text-xl ml-4 mt-1">Tournaments</h1>
                    <TournamentButton className="w-3xs h-3xs mb-3 mt-3 justify-self-end">
                        <div className="flex flex-row w-full">
                            <PlusIcon size={30} className="ml-4 my-auto mt-2"/>
                            <h2 className="font-font text-secondary font-semibold text-sm ml-5 my-auto mt-2">Host Tournament</h2>
                        </div>
                    </TournamentButton>
                    <h2 className=" text-primary-text text-sm ml-4 -mt-1 w-full mb-10 ">Join Live Battles or Clash With Friends</h2>
                </div>

                

                <div className="justify-end w-4xl flex flex-row gap-2 mb-15 h-8 gap-5">
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
                    <MathTournamentCard/>
                    <ProgrammingTournamentCard/>
                    <MathTournamentCard/>
                </div>
            </div> 
        </div>
    )
}

export default Tournaments;