import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom"


export const TournamentEliminated = () => {
    const nav = useNavigate();

    return (
        <div className="w-full bg-black flex flex-col items-center justify-evenly">
            <h1>YOU'VE BEEN ELIMINATED</h1>
            <p>Unfortunately you weren't fast enough. Better luck next time</p>
            <Button
                onClick={() => nav('/dashboard')}
                variant={'default'}
            >Return to Dashboard</Button>
        </div>
    )

}