export const TournamentEliminated = () => {

    return (
        <div className=" min-h-screen w-full bg-black flex flex-col items-center justify-center">

            <h1 className="text-4xl font-bold text-white">
                YOU'VE BEEN ELIMINATED
            </h1>

            <p className="text-lg text-gray-400">
                Unfortunately you weren't fast enough. Better luck next time
            </p>

            <div className="text-center pt-[2rem]">
                <h2 className="text-md font semibold text-white">
                    The tournament is still in progress
                </h2>

                <p className="mt-2 text-gray-500">
                    Please wait while the remaining players battle it out.
                    You'll be notified when the tournament ends.
                </p>
            </div>

        </div>
    )

}