import {motion} from 'framer-motion';

import happy from "../../assets/svgs/happy.svg"
import rightShoulder from "../../assets/svgs/right-shoulder.svg"
import rightArm from "../../assets/svgs/right-forearm.svg"
import torso from "../../assets/svgs/torso.svg"
import peace from "../../assets/svgs/peace.svg"
import { StationaryLeftArm } from './rig';
import { BothLegs } from './rig';
//The above imports though pasted, were all hand-written and are not copied from any generative ai chat

export const Peace = ({
    vb1= 250,
    vb2 = 170,
    width= "100%",
    height = "100%"
}) => {

    return(
        <svg viewBox={`0 0 ${vb1} ${vb2}`} width={width} height={height} preserveAspectRatio="xMidYMid meet">
            <motion.g>
                <image href={torso} width="50" x="60" y="40" height="120"/>
                <image href={happy} width="50" x="60" y="40" height="45"/>

                <StationaryLeftArm/>

                <motion.g
                    style={{originX: "58px", originY: "100px", transformBox: "view-box"}}
                    initial={{rotate: 20}}
                    >
                    <image href={rightShoulder} width="50" x="28" y="92" height="55"/>
                    <motion.g
                        style={{originX: "50px", originY: "120px", transformBox: "view-box"}}
                        initial={{rotate: 125}}>
                        <image href={rightArm} width="50" x="26" y="117" height="25"/>
                        <motion.g
                            initial={{rotate: 180}}
                            >
                            <image href={peace} width="50" x="19" y="131" height="25"/>
                        </motion.g>
                    </motion.g>
                </motion.g>

            </motion.g>

            <BothLegs/>
        </svg>
    )
}