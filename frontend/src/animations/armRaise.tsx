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


//The following code and the above imports though pasted, are all hand-written portions of code and are not copied from any genertaive ai chat, to save a great amount of time i have elected to paste my prvious work and just change it
export const ArmRaise = () => {

    return(
        <div className="bg-[#000000] min-h-screen w-full">

        <svg viewBox="0 0 300 400" width="600" height="700" preserveAspectRatio="xMidYMid meet">

            <motion.g
                style={{originX: 0.85, originY: 1.2}}
                animate={{rotate: 15}}
                transition={{
                    // repeat: Infinity, 
                    // repeatType: "loop",
                    ease: "easeInOut",
                    type: "tween",
                    duration: 0.4
                }}>
            <image href={torso} width="50" x="60" y="40" height="120"/>
            <image href={head} width="50" x="60" y="40" height="45"/>

             <motion.g
                style={{originX: "40px", originY: "0px"}}
                animate={{rotate: -15}}
                >
                <image href={rightLeg} width="50" x="40" y="121" height="57"/>
                <image href={leftLeg} width="50" x="75" y="121" height="57"/>
            </motion.g>

            
            <motion.g
                // style={{originX: "224px", originY: "23px"}}
                // animate={{rotate: 80}}
                // transition={{
                //     type: "spring",
                //     delay: 0.4,
                // }}
                >

                <image href={leftShoulder} width="50" x="93" y="92" height="55"/>

                <motion.g
                    // style={{originX: "30px", originY: "2px"}}
                    // animate={{rotate: [0, 20, 80, 87]}}
                    // transition={{
                    //     type: "spring",
                    // }}
                    >
                    <image href={leftArm} width="50" x="95" y="117" height="25"/>

                    <motion.g
                    >
                        
                        <image href={leftHand} width="50" x="94" y="132" height="17"/>
                    </motion.g>
                </motion.g>
            </motion.g>

            
            <motion.g>
            <image href={rightShoulder} width="50" x="28" y="92" height="55"/>

                <motion.g
                    style={{originX: 0.42, originY: 0.1}}
                    animate={{rotate: -140}}
                    transition={{
                        duration: 0.4,
                    }}
                    >
                <image href={rightArm} width="50" x="26" y="117" height="25"/>

                <motion.g
                //initial={{rotate: 180}}
                >
                <image href={rightHand} width="50" x="25" y="131" height="17"/>
                </motion.g>

                </motion.g>
            </motion.g>
            </motion.g>

           
        </svg>
        </div>
    )
}
