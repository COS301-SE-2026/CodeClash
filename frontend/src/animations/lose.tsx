import {motion, useMotionValue, animate} from 'framer-motion';
import {useRef, useEffect} from "react";
import angry from "../svgs/angry.svg"
import antenna from "../svgs/antenna.svg"
import celebrate from "../svgs/celebrate.svg"
import confused from "../svgs/confused.svg"
import excited from "../svgs/excited.svg"
import fist from "../svgs/fist.svg"
import happy from "../svgs/happy.svg"
import head from "../svgs/head.svg"
import leftShoulder from "../svgs/left-shoulder.svg"
import leftArm from "../svgs/left-forearm.svg"
import leftHand from "../svgs/left-hand.svg"
import leftLeg from "../svgs/left-leg.svg"
import losing from "../svgs/losing.svg"
import neutral from "../svgs/neutral.svg"
import ok from "../svgs/ok.svg"
import peace from "../svgs/peace.svg"
import rightShoulder from "../svgs/right-shoulder.svg"
import rightArm from "../svgs/right-forearm.svg"
import rightHand from "../svgs/right-hand.svg"
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
import { headVariants } from "./rig";
import { leftHandVariants } from "./rig";
import { rightHandVariants } from "./rig";


//The following code and the above imports though pasted, are all hand-written portions of code and are not copied from any generative ai chat, to save a great amount of time i have elected to paste my previous work and just change it
export const Lose = () => {

    return(
        <div className="bg-[#000000] min-h-screen w-full">

        <svg viewBox="0 0 300 400" width="600" height="700" preserveAspectRatio="xMidYMid meet">

            <motion.g>
            <image href={torso} width="50" x="60" y="40" height="120"/>

            <motion.g
            
                initial={{y: 0}}
                animate={{y: 3}}
                transition={{
                    delay: 0.4,
                    duration: 0.4
                }}>

            <image href={wrong} width="50" x="60" y="40" height="45"/>
            </motion.g>


             <motion.g>
                <image href={rightLeg} width="50" x="40" y="121" height="57"/>
            </motion.g>

            <motion.g>
                <image href={leftLeg} width="50" x="80" y="121" height="57"/>
            

            </motion.g>

            
            <motion.g
            
            style={{originX: "108px", originY: "100px", transformBox: "view-box"}}
            animate={{rotate: -110}}
            transition={{
                duration: 0.4
            }}
            >

                <image href={leftShoulder} width="50" x="93" y="95" height="55"/>

                <motion.g
                    style={{originX: "122px", originY: "120px", transformBox: "view-box"}}
                    animate={{rotate: -110}}
                    transition={{
                        delay: 0.3,
                        duration: 0.3
                    }}>
                    <image href={leftArm} width="50" x="92" y="117" height="25"/>

                    <motion.g
                    initial={{rotate: 190}}>
                        <image href={wave} width="50" x="100" y="129" height="25"/>
                    </motion.g>
                </motion.g>
            </motion.g>

            
            <motion.g>
            <image href={rightShoulder} width="50" x="28" y="92" height="55"/>

                <motion.g>
                <image href={rightArm} width="50" x="26" y="117" height="25"/>

                <motion.g>
                <image href={rightHand} width="50" x="26" y="131" height="17"/>
                </motion.g>

                </motion.g>
            </motion.g>
            </motion.g>

           
        </svg>
        </div>
    )
}