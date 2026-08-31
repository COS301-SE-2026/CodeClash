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
import leftArm from "../svgs/left-forearm.svg"
import leftHand from "../svgs/left-hand.svg"
import leftLeg from "../svgs/left-leg.svg"
import losing from "../svgs/losing.svg"
import neutral from "../svgs/neutral.svg"
import ok from "../svgs/ok.svg"
import peace from "../svgs/peace.svg"
import rightArm from "../svgs/right-forearm.svg"
import rightHand from "../svgs/left-hand.svg"
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

export const headVariants = {
    variants: [head, angry, confused, excited, happy, losing, neutral, sad, surprised, thinking, wink, winning, worried, wrong]
}

export const rightHandVariants = { //from the avatar's perspective
    variants: [rightHand, peace, thinkingHand, wave]
}

export const leftHandVariants = {
    variants: [leftHand, fist, ok]
}

interface Bone{
    id: number,
    variants: string[]
}

export interface Avatar{
    head: Bone,
    rightHand: Bone,
    leftHand: Bone
}

export const MyComponent = () => {
    return(
        <div className="bg-[#000000] min-h-screen w-full">
        <svg viewBox="0 0 100 100" width="400" height="300"> 
            {/* keep above values as constants */}

        <motion.g
        >
            <image href={rightLeg} width="30%" x="-3%" y="62%" height="30%"/>
        </motion.g>
        <motion.g>
            <image href={leftLeg} width="30%" x="15%" y="62%" height="30%"/>
        </motion.g>
        <motion.g>
            <image href={rightArm} width="30%" x="-11%" y="44%" height="25%"></image>
        </motion.g>

        <motion.g
            initial={{opacity: 0, y:-50}}
            animate={{ opacity: 1, y:0}}>
            <image href={leftArm} width="30%" x="23%" y="44%" height="25%"></image>
        </motion.g>
        <motion.g
        >
            <image href={torso} width="30%" x="6%" y="34%" height="30%"/>
        </motion.g>
        <motion.g
        // style={{ originX: -0.5, originY: -0.5}}
        >
            <image href={headVariants.variants[4]} width="30%" x="6%" y="12%" height="30%"/>
        </motion.g>
        <motion.g>
            <image href={rightHand} width="30%" x="-10.5" y="63%" height="10%"/>
        </motion.g>
        <motion.g>
            <image href={leftHand} width="30%" x="22.5%" y="63%" height="10%"/>
        </motion.g>
        </svg>
        </div>
    );
}

//let's make individual bone class, and build a bass class for a standing avatar, in the bone class we will have width and height and x and y, href={part} for img and 
//allow svg view box width and height value (NOT PERCENT REMEMBER) to be edited
// interface Bone {
//     id: string, //id of variant
//     part: string, //leg, arm, body etc.
//     // variants: string[],
//     // animateState: string,
//     // children: React.ReactNode
// }


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