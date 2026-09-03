import {motion} from 'framer-motion';

import excited from "../assets/svgs/excited.svg"
import leftShoulder from "../assets/svgs/left-shoulder.svg"
import leftArm from "../assets/svgs/left-forearm.svg"
import leftHand from "../assets/svgs/left-hand.svg"
import leftLeg from "../assets/svgs/left-leg.svg"
import rightShoulder from "../assets/svgs/right-shoulder.svg"
import rightArm from "../assets/svgs/right-forearm.svg"
import rightHand from "../assets/svgs/right-hand.svg"
import rightLeg from "../assets/svgs/right-leg.svg"
import torso from "../assets/svgs/torso.svg"



export const Yes = ({
    vb1 = 250,
    vb2 = 170,
    width = 390,
    height = 300
}) => {

    return(
        <svg viewBox={`0 0 ${vb1} ${vb2}`} width={width} height={height} preserveAspectRatio="xMidYMid meet">

        <motion.g animate={{y: [0, -1.2, 0], scaleY: [1, 1.04, 1]}}
        transition={
           {duration: 3,
            repeat: Infinity,
            ease: "easeInOut"}
        }
        >
            <image href={torso} width="50" x="60" y="40" height="120"/>
            <image href={excited} width="50" x="60" y="40" height="45"/>

            <motion.g>
                <image href={rightLeg} width="50" x="40" y="122" height="57"/>
                <image href={leftLeg} width="50" x="80" y="122" height="57"/>
                <image href={rightShoulder} width="50" x="28" y="92" height="55"/>
                <image href={rightArm} width="50" x="26" y="117" height="25"/>
                <image href={rightHand} width="50" x="27" y="132" height="17"/>
            


            <motion.g
                style={{originX: "115px", originY: "100px", transformBox: "view-box"}}
                initial={{y: 0}}
                animate={{rotate: -5, y: 1}}
                transition={{
                    duration: 1.1,
                    type: "spring",
                    delay: 0.1,
                }}
                >

                <image href={leftShoulder} width="50" x="93" y="92" height="55"/>

                <motion.g
                    style={{originX: "123px", originY: "117px", transformBox: "view-box"}}
                    initial={{rotate: 150, y: 0}}
                    animate={{y: 7}}
                    transition={{
                        type: "spring",
                        duration: 1.5
                    }}
                    >
                    <image href={leftArm} width="50" x="95" y="117" height="25"/>

                    <motion.g
                    animate={{rotate: 5}}
                    transition={{
                        delay: 0.4,
                        duration: 0.8
                    }}
                    >
                        
                        <image href={leftHand} width="50" x="92" y="130" height="17"/>
                    </motion.g>
                </motion.g>
                </motion.g>
            </motion.g>
            </motion.g>
        </svg>
    )
}
