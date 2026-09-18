import "../styles/global.css"
import { Card } from "../../@/components/ui/card"


const TournamentsWaiting = () => {
    return(
        <div className="w-full max-h-screen">
            <div className="flex flex-col">
                <Card className="bg-card border-[var(--button-tournament-secondary)] border-[0.5px] flex flex-col ">
                    <div className="flex flex-row">
                        <h1 className="font-font font-semibold text-2xl">Tournament Title</h1>
                        <Card className="bg-card border-[var(--button-tournament-secondary)] border-[0.5px]">
                            <div className="flex flex-row">

                            </div>
                        </Card>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default TournamentsWaiting;