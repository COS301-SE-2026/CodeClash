import {motion, useMotionValue, animate} from 'framer-motion';

import wink from "../../svgs/wink.svg"
import leftShoulder from "../../svgs/left-shoulder.svg"
import leftArm from "../../svgs/left-forearm.svg"
import okay from "../../svgs/ok.svg"
import leftLeg from "../../svgs/left-leg.svg"
import rightShoulder from "../../svgs/right-shoulder.svg"
import rightArm from "../../svgs/right-forearm.svg"
import rightHand from "../../svgs/right-hand.svg"
import rightLeg from "../../svgs/right-leg.svg"
import torso from "../../svgs/torso.svg"
import peace from "../../svgs/peace.svg"


//The above imports though pasted, were all hand-written and are not copied from any generative ai chat

export const Okay = () => {
    return(
        <svg viewBox="0 0 300 400" width="600" height="700" preserveAspectRatio="xMidYMid meet">
            <motion.g>
                <image href={torso} width="50" x="60" y="40" height="120"/>
                <image href={wink} width="50" x="60" y="40" height="45"/>

                <motion.g
                    style={{originX: "108px", originY: "100px", transformBox: "view-box"}}
                    initial={{rotate: -45}}
                    >
                    <image href={leftShoulder} width="50" x="91" y="92" height="55"/>
                    <motion.g
                        style={{originX: "120px", originY: "117px", transformBox: "view-box"}}
                        initial={{rotate: -120}}
                        >
                        <image href={leftArm} width="50" x="93" y="116" height="25"/>
                        <motion.g
                        //style={{originX: "50px", originY: ""}}
                        initial={{rotate: 170}}
                        >
                            <image href={okay} width="50" x="100.5" y="130" height="25"/>
                        </motion.g>
                    </motion.g>
                </motion.g>
            </motion.g>
        </svg>
    )
}