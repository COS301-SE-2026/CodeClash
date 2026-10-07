import { Skull } from 'lucide-react';
import Starfield from '@/components/ui/animations/Starfield';

export const TournamentEliminated = () => {
    return (
        <div className="relative w-full min-h-screen overflow-hidden flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/75 to-background" />
            <Starfield />

            <div className="relative z-10 w-full max-w-xl flex flex-col gap-6">
                <div className="card-elevated flex flex-col items-center gap-3 p-8 text-center">
                    <div className="w-14 h-14 rounded-full border-2 border-danger flex items-center justify-center mb-2">
                        <Skull size={24} className="text-danger" />
                    </div>

                    <h1 className="text-xl font-bold text-primary-text uppercase tracking-wide">
                        YOU'VE BEEN ELIMINATED
                    </h1>

                    <p className="text-xsm text-muted">
                        Unfortunately you weren't fast enough. Better luck next time
                    </p>
                </div>

                <div className="card-elevated p-5 text-center" role="status" aria-live="polite">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="size-2 rounded-full bg-primary animate-pulse" />
                        <h2 className="text-md font semibold text-white">
                            The tournament is still in progress
                        </h2>
                    </div>
        
                    <p className="text-xsm text-muted-text">
                        Please wait while the remaining players battle it out.
                        You'll be notified when the tournament ends.
                    </p>
                </div>
            </div>
        </div>
    )
}