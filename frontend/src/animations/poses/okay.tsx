import {motion} from 'framer-motion';

import wink from "../../assets/svgs/wink.svg"
import leftShoulder from "../../assets/svgs/left-shoulder.svg"
import leftArm from "../../assets/svgs/left-forearm.svg"
import okay from "../../assets/svgs/ok.svg"
import leftLeg from "../../assets/svgs/left-leg.svg"
import rightShoulder from "../../assets/svgs/right-shoulder.svg"
import rightArm from "../../assets/svgs/right-forearm.svg"
import rightHand from "../../assets/svgs/right-hand.svg"
import rightLeg from "../../assets/svgs/right-leg.svg"
import torso from "../../assets/svgs/torso.svg"


//The above imports though pasted, were all hand-written and are not copied from any generative ai chat

export const Okay = ({
    vb1 = 250,
    vb2 = 170,
    width= 390,
    height= 300
}) => {
    return(
        <svg viewBox={`0 0 ${vb1} ${vb2}`} width={width} height={height} preserveAspectRatio="xMidYMid meet">
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

                <motion.g>
                    <image href={rightShoulder} width="50" x="28" y="92" height="55"/>
                    <motion.g>
                        <image href={rightArm} width="50" x="26" y="117" height="25"/>
                        <motion.g>
                            <image href={rightHand} width="50" x="26" y="131" height="17"/>
                        </motion.g>
                    </motion.g>
                </motion.g>

                <motion.g>
                    <image href={rightLeg} width="50" x="40" y="121" height="57"/>
                    <image href={leftLeg} width="50" x="80" y="121" height="57"/>
                </motion.g>
            </motion.g>
        </svg>
    )
}