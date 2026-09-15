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
                    <h1 className="font-font font-semibold text-xl ml-3 mt-3">Tournaments</h1>
                    <TournamentButton className="w-[45%] h-[60%] my-auto ml-20">
                        <div className="grid grid-cols-2 w-full">
                            <PlusIcon size={50} className="mb-4 ml-3 -mt-5"/>
                            <h2 className="font-font font-semibold text-md mb-4 -ml-7 -mt-5">Host Tournament</h2>
                        </div>
                    </TournamentButton>
                    <h2 className="font-font text-sm -mt-3 ml-3">Join Tournaments to Compete With Up to 30 Players! Invite Friends to Join in on the Fun!</h2>
                </div>

                <div className="flex grid grid-rows-2 w-full">
                    
                </div>

            </div> 
        </div>
    )
}

export default Tournaments;