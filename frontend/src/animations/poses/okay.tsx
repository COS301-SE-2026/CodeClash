import {motion} from 'framer-motion';

import wink from "../../assets/svgs/wink.svg"
import leftShoulder from "../../assets/svgs/left-shoulder.svg"
import leftArm from "../../assets/svgs/left-forearm.svg"
import okay from "../../assets/svgs/ok.svg"
import torso from "../../assets/svgs/torso.svg"
import { BothLegs } from './rig';
import { StationaryRightArm } from './rig';

//The above imports though pasted, were all hand-written and are not copied from any generative ai chat

export const Okay = ({
    vb1 = 250,
    vb2 = 170,
    width= "100%",
    height= "100%"
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

                <StationaryRightArm/>

                <BothLegs/>
            </motion.g>
        </svg>
    )
}