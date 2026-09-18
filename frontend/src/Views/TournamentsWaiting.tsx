import "../styles/global.css"
import { Card } from "../../@/components/ui/card"
import {LogOut} from "lucide-react"


const TournamentsWaiting = () => {
    return(
        <div className="w-full max-h-screen">
            <div className="flex flex-col w-[80%]">
                <Card className="bg-card border-[var(--button-tournament-secondary)] border-[0.5px] flex flex-col ">
                    <div className="flex flex-row">
                        <h1 className="font-font font-semibold text-2xl">Tournament Title</h1>
                        <Card className="bg-card border-[var(--button-tournament-secondary)] border-[0.5px] ml-200">
                            <div className="flex flex-row gap-4">
                                <LogOut size={35} className="text-muted-text ml-4"/>
                                <h2 className="font-font font-semibold text-[1.7rem] text-muted-text -mt-1 px-2 -ml-2">Leave Waiting Room</h2>
                            </div>
                        </Card>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default TournamentsWaiting;