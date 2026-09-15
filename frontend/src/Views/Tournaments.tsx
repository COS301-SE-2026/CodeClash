//This is a wow factor - i am just calling the coming soon component so the page isnt blank when clicked from dashboard
import TournamentButton from "@/components/ui/TournamentButton"
// import ComingSoon from "@/components/ui/ComingSoon";

const Tournaments = () => {
    return (
        <div className="min-h-flex">
            {/* <ComingSoon
                fullscreen={false}/>
         */}
        <TournamentButton/>
        </div>
    )
}

export default Tournaments;