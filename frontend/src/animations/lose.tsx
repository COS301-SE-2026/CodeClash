import {motion} from 'framer-motion';
import leftShoulder from "../assets/svgs/left-shoulder.svg"
import leftArm from "../assets/svgs/left-forearm.svg"
import leftLeg from "../assets/svgs/left-leg.svg"
import rightShoulder from "../assets/svgs/right-shoulder.svg"
import rightArm from "../assets/svgs/right-forearm.svg"
import rightHand from "../assets/svgs/right-hand.svg"
import rightLeg from "../assets/svgs/right-leg.svg"
import torso from "../assets/svgs/torso.svg"
import wave from "../assets/svgs/wave.svg"
import wrong from "../assets/svgs/wrong.svg"


//The following code and the above imports though pasted, are all hand-written portions of code and are not copied from any generative ai chat, to save a great amount of time i have elected to paste my previous work and just change it
export const Lose = ({
    vb1 = 250,
    vb2 = 170,
    width = "100%",
    height = "100%"
}) => {

    return(
        <svg viewBox={`0 0 ${vb1} ${vb2}`} width={width} height={height} preserveAspectRatio="xMidYMid meet">

            <motion.g animate={{y: [0, -1.2, 0], scaleY: [1, 1.04, 1]}}
            transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            >
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

        </motion.g>   
        </svg>
    )
}