import { MatchTimer } from "./MatchTimer"
import { Progress } from "@/components/ui/progress"

interface MatchHeaderProps {
    avatars: string[],
    player_life: number[],
    duration: number,
    onExpire: () => void

}


export const MatchHeader = ({
    avatars,
    player_life,
    duration,
    onExpire
}:MatchHeaderProps) => {
    return (
        <div className='flex w-full h-[20%] justify-between items-center '>
            {/* Player 1 Progress */}
            <div className="flex w-[50%] h-[60%] items-center m-2">
                <img
                    src={avatars[0]}
                    alt="user 1 avatar"
                    className='h-[120%] flex items-center'
                />

                <div className='w-[70%] flex flex-col items-start h-[70%] justify-between self-end'>
                    <Progress
                        value={player_life[0]}
                        progress_colour='var(--primary)'
                        className='w-full h-9 shadow-[0_4px_6px_rgba(0,0,0,0.3)]'
                    />
                    {/* <Badge variant={'default'} className='text-[1.25rem] w-[50%] h-[35%]'>{match_data.usernames[0]}</Badge> */}
                </div></div>

            {/* Clock */}
            <MatchTimer
                duration={duration}
                onExpire={onExpire}
            />

            {/* Player 2 Progress */}
            <div className='flex w-[50%] h-[60%] items-center justify-end'>
                <div className=' w-[70%] flex flex-col items-end h-[70%] justify-between self-end'>
                    {/* <Progress
                        value={player_life[1]}
                        progress_colour={colour}
                        className='w-full h-9 shadow-[0_4px_6px_rgba(0,0,0,0.3)] scale-x-[-1]'
                    />
                    <Badge variant={'secondary'} className='text-[1.25rem] w-[50%] h-[25%]'>{usernames[1]}</Badge> */}
                </div>

                <img
                    src={avatars[1]}
                    alt="user 1 avatar"
                    className='scale-x-[-1] h-[120%] flex items-center '
                />
            </div>
        </div>
    )
}