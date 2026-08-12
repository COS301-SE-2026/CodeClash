//This will be a shared ui component for the starfield animation- I have been using it often and think this is better than duplicating the same code
//I have also copied this code from the existing code in Dashboard, Signin and Signup instead of re typing

import { useMemo } from "react";

const secureRandom = ()=> {
  const arr = new Uint32Array(1);
  window.crypto.getRandomValues(arr);
  return arr[0] / (0xffffffff + 1);
}

type StarfieldProps = {
    count?: number;
}

const Starfield = ({count = 40}: StarfieldProps) => {
    const stars = useMemo (
        () => Array.from({length: 40}, (_,i) => ({
            id: i, top: secureRandom() *100, left: secureRandom() *100, delay: secureRandom() * 3,
        })), [count]
    )
    return (
        <div className="starfield">
            {stars.map((star) => (
                <span key={star.id} style={{top: `${star.top}%`, left: `${star.left}%`, animationDelay: `${star.delay}s`}}/>
            ))}
        </div>
    )
}

export default Starfield;