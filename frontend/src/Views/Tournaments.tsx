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
                    <h1 className="font-font font-semibold my-auto text-3xl">Tournaments</h1>
                    <TournamentButton className="w-[40%] h-[75%]">
                        <div className="grid grid-cols-2 w-full">
                            <PlusIcon/>
                            <h2 className="font-font font-semibold mx-auto text-xl">Host Tournament</h2>
                        </div>
                    </TournamentButton>
                    <h2 className="font-font text-xl">Join Tournaments to Compete With Up to 30 Players! Invite Friends to Join in on the Fun!</h2>
                </div>

            </div> 
        </div>
    )
}

export default Tournaments;