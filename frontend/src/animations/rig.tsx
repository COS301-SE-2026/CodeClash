import React from "react";
import {motion} from 'framer-motion';
import angry from "../svgs/angry.svg"
import antenna from "../svgs/antenna.svg"
import celebrate from "../svgs/celebrate.svg"
import confused from "../svgs/confused.svg"
import excited from "../svgs/excited.svg"
import fist from "../svgs/fist.svg"
import happy from "../svgs/happy.svg"
import head from "../svgs/head.svg"
import leftArm from "../svgs/left-arm.svg"
import leftLeg from "../svgs/left-leg.svg"
import losing from "../svgs/losing.svg"
import neutral from "../svgs/neutral.svg"
import ok from "../svgs/ok.svg"
import peace from "../svgs/peace.svg"
import rightArm from "../svgs/right-arm.svg"
import rightLeg from "../svgs/right-leg.svg"
import sad from "../svgs/sad.svg"
import surprised from "../svgs/surprised.svg"
import thinkingHand from "../svgs/thinking-hand.svg"
import thinking from "../svgs/thinking.svg"
import torso from "../svgs/torso.svg"
import wave from "../svgs/wave.svg"
import wink from "../svgs/wink.svg"
import winning from "../svgs/winning.svg"
import worried from "../svgs/worried.svg"
import wrong from "../svgs/wrong.svg"

export const MyComponent = () => {
    return(
        <div className="bg-[#000000] min-h-screen w-full">
        <svg viewBox="0 0 100 100" width="300" height="300"> 
            {/* keep above values as constants */}

        <motion.g>
            <image
        </motion.g>

        <motion.g>
            <image href={leftArm} width="30%" x="24%" y="44%" height="30%"></image>
        </motion.g>
        <motion.g
        // style={{ originX: 0.5, originY: 0.5}}
        
        
        
        >
            <image href={torso} width="30%" x="6%" y="34%" height="30%"/>
        </motion.g>
        <motion.g
        // style={{ originX: -0.5, originY: -0.5}}
        >
            <image href={head} width="30%" x="6%" y="12%" height="30%"/>
        </motion.g>
        </svg>
        </div>
    );
}

//let's make individual bone class, and build a bass class for a standing avatar, in the bone class we will have width and height and x and y, href={part} for img and 
//allow svg view box width and height value (NOT PERCENT REMEMBER) to be edited
interface BoneProps {
    id: string, //id of variant
    part: string, //leg, arm, body etc.
    variants: string[],
    animateState: string,
    children: React.ReactNode
}


//there will be a "bone" for every body part, that will be used in every rig that exists per animation - variations exist so that it can be swapped out

// function Bone({id, part, variants, animateState, children} : BoneProps){
//     return(
//         <motion.g
//         style={{ originX: part.pivot.x, originY: part.pivot.y }}
//         variants={variants[id]}
//         animate={animateState}
//         initial="idle"
//         >
//             <image href={part.src} width={part.width} height={part.height} />
//             {children}
//         </motion.g>
    
//     );
// }