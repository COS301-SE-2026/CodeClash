//This is a wow factor - i am just calling the coming soon component so the page isnt blank when clicked from dashboard
//import TournamentCard from "@/components/ui/TournamentCard"
import TournamentButton from "@/components/ui/TournamentButton"
// import ComingSoon from "@/components/ui/ComingSoon";
import "../styles/global.css"
import {PlusIcon} from "lucide-react"

const Tournaments = () => {
    return (
        <div className="w-full min-h-flex">
            <div className="h-full w-full flex grid grid-rows-3">
                <div className="flex grid grid-cols-2 h-full w-full">
                    <h1 className="font-font font-semibold mx-auto font-3xl">Tournaments</h1>
                    <TournamentButton className="w-[35%] h-[110%]">
                        <PlusIcon/>
                        <h2 className="font-font font-semibold mx-auto font-xl">Host Tournament</h2>
                    </TournamentButton>
                </div>
            </div>
           
        </div>
    )
}

export default Tournaments;