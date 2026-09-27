import { useMemo, useEffect } from "react";
import { useTimer } from "react-timer-hook";

interface MatchTimerProps {
    duration: number,
    onExpire: () => void
}

export const MatchTimer = ({ duration, onExpire }: MatchTimerProps) => {

    const expiry_time = useMemo(() => {
        const time = new Date();
        time.setSeconds(time.getSeconds() + duration * 60);
        return time;
    }, [duration]);


    const timer = useTimer({
        expiryTimestamp: expiry_time,
        autoStart: false,
        onExpire
    });

    useEffect(() => {
        if (duration > 0) timer.restart(expiry_time);
    }, [duration]);

    const {minutes, seconds} = timer;

    return (
        <div className='text-white font-dseg w-[15%] h-20 flex items-center justify-center text-5xl font-semibold border-6 rounded-l'>
            <span>
                {String(minutes).padStart(2, "0")}:
                {String(seconds).padStart(2, "0")}
            </span>
        </div>
    )
}