import { motion, useMotionValue, animate } from 'framer-motion';

import happy from "../assets/svgs/happy.svg"
import torso from "../assets/svgs/torso.svg"
import leftShoulder from "../assets/svgs/left-shoulder.svg"
import leftArm from "../assets/svgs/left-forearm.svg"
import leftHand from "../assets/svgs/left-hand.svg"
import leftLeg from "../assets/svgs/left-leg.svg"
import rightShoulder from "../assets/svgs/right-shoulder.svg"
import rightArm from "../assets/svgs/right-forearm.svg"
import rightHand from "../assets/svgs/right-hand.svg"
import rightLeg from "../assets/svgs/right-leg.svg"
import { headVariants } from "./poses/rig";
import { leftHandVariants } from "./poses/rig";
import { rightHandVariants } from "./poses/rig";


//The following code and the above imports though pasted, are all hand-written portions of code and are not copied from any generative ai chat, to save a great amount of time i have elected to paste my previous work and just change it
export const ArmRaise = () => {

    return (
        <svg viewBox="0 0 250 170" width="390" height="300" preserveAspectRatio="xMidYMid meet">

        <motion.g animate={{y: [0, -1.2, 0], scaleY: [1, 1.04, 1]}}
            transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }}>
            <motion.g
                style={{ originX: "90px", originY: "115px", transformBox: "view-box" }}
                animate={{ rotate: 15 }}
                transition={{
                    ease: "easeInOut",
                    type: "tween",
                    duration: 0.3,
                    delay: 0.2
                }}>
                <image href={torso} width="50" x="60" y="40" height="120" />
                <image href={happy} width="50" x="60" y="40" height="45" />


                <motion.g>

                    <image href={leftShoulder} width="50" x="93" y="92" height="55" />

                    <motion.g>
                        <image href={leftArm} width="50" x="95" y="117" height="25" />

                        <motion.g>
                            <image href={leftHand} width="50" x="94" y="131" height="17" />
                        </motion.g>
                    </motion.g>
                </motion.g>


                <motion.g

                    style={{ originX: "58px", originY: "100px", transformBox: "view-box" }}
                    animate={{ rotate: -180 }}
                    transition={{
                        delay: 0.3,
                        duration: 0.3
                    }}
                >
                    <image href={rightShoulder} width="50" x="28" y="92" height="55" />

                    <motion.g
                        style={{ originX: "50px", originY: "120px", transformBox: "view-box" }}
                        animate={{ rotate: [0, -140, 0] }}
                        transition={{
                            delay: 0.1,
                            duration: 0.4,
                        }}
                    >
                        <image href={rightArm} width="50" x="26" y="117" height="25" />

                        <motion.g>
                            <image href={rightHand} width="50" x="26" y="131" height="17" />
                        </motion.g>

                    </motion.g>
                </motion.g>
            </motion.g>
        </motion.g>  

        <motion.g
                    style={{ originX: "40px", originY: "0px" }}
                    animate={{ rotate: 10 }}
                    transition={{
                        delay: 0.1,
                        duration: 0.2
                    }}
                >
                    <image href={rightLeg} width="50" x="40" y="121" height="57" />
                </motion.g>

                <motion.g

                    animate={{ rotate: -10 }}
                    transition={{
                        delay: 0.1,
                        duration: 0.2
                    }}>

                    <image href={leftLeg} width="50" x="80" y="121" height="57" />

                </motion.g>              
        </svg>
    )
}
