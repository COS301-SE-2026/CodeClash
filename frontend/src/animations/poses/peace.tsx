import {motion, useMotionValue, animate} from 'framer-motion';

import happy from "../../svgs/happy.svg"
import leftShoulder from "../../svgs/left-shoulder.svg"
import leftArm from "../../svgs/left-forearm.svg"
import leftHand from "../../svgs/left-hand.svg"
import leftLeg from "../../svgs/left-leg.svg"
import rightShoulder from "../../svgs/right-shoulder.svg"
import rightArm from "../../svgs/right-forearm.svg"
import rightHand from "../../svgs/right-hand.svg"
import rightLeg from "../../svgs/right-leg.svg"
import torso from "../../svgs/torso.svg"
import peace from "../../svgs/peace.svg"


//The above imports though pasted, were all hand-written and are not copied from any generative ai chat

export const Peace = () => {

    return(
        <svg viewBox="0 0 300 400" width="600" height="700" preserveAspectRatio="xMidYMid meet">
            <motion.g>
                <image href={torso} width="50" x="60" y="40" height="120"/>
                <image href={happy} width="50" x="60" y="40" height="45"/>

                <motion.g>
                    <image href={leftShoulder} width="50" x="93" y="92" height="55"/>
                    <motion.g>
                        <image href={leftArm} width="50" x="95" y="117" height="25"/>

                        <motion.g>
                            <image href={leftHand} width="50" x="94" y="131" height="17"/>
                        </motion.g>
                    </motion.g>
                </motion.g>

                <motion.g
                    style={{originX: "58px", originY: "100px", transformBox: "view-box"}}>
                    
                    <image href={rightShoulder} width="50" x="28" y="92" height="55"/>
                    <motion.g
                        style={{originX: "50px", originY: "120px", transformBox: "view-box"}}
                        initial={{rotate: 120}}>
                        <image href={rightArm} width="50" x="26" y="117" height="25"/>
                        <motion.g
                            initial={{rotate: 180}}
                            >
                            <image href={peace} width="50" x="19" y="131" height="25"/>
                        </motion.g>
                    </motion.g>
                </motion.g>

            </motion.g>


            <motion.g>
                <image href={rightLeg} width="50" x="40" y="121" height="57"/>
                <image href={leftLeg} width="50" x="80" y="121" height="57"/>
            </motion.g>
        </svg>
    )
}