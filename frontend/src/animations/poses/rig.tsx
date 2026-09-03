import {motion} from 'framer-motion';
import angry from "../../assets/svgs/angry.svg"
import confused from "../../assets/svgs/confused.svg"
import excited from "../../assets/svgs/excited.svg"
import fist from "../../assets/svgs/fist.svg"
import happy from "../../assets/svgs/happy.svg"
import head from "../../assets/svgs/head.svg"
import leftShoulder from "../../assets/svgs/left-shoulder.svg"
import leftArm from "../../assets/svgs/left-forearm.svg"
import leftHand from "../../assets/svgs/left-hand.svg"
import leftLeg from "../../assets/svgs/left-leg.svg"
import losing from "../../assets/svgs/losing.svg"
import neutral from "../../assets/svgs/neutral.svg"
import ok from "../../assets/svgs/ok.svg"
import peace from "../../assets/svgs/peace.svg"
import rightShoulder from "../../assets/svgs/right-shoulder.svg"
import rightArm from "../../assets/svgs/right-forearm.svg"
import rightHand from "../../assets/svgs/right-hand.svg"
import rightLeg from "../../assets/svgs/right-leg.svg"
import sad from "../../assets/svgs/sad.svg"
import surprised from "../../assets/svgs/surprised.svg"
import thinkingHand from "../../assets/svgs/thinking-hand.svg"
import thinking from "../../assets/svgs/thinking.svg"
import torso from "../../assets/svgs/torso.svg"
import wave from "../../assets/svgs/wave.svg"
import wink from "../../assets/svgs/wink.svg"
import winning from "../../assets/svgs/winning.svg"
import worried from "../../assets/svgs/worried.svg"
import wrong from "../../assets/svgs/wrong.svg"

export const headVariants = {
    variants: [head, angry, confused, excited, happy, losing, neutral, sad, surprised, thinking, wink, winning, worried, wrong]
}

export const rightHandVariants = { //from the avatar's perspective
    variants: [rightHand, peace, thinkingHand]
}

export const leftHandVariants = {
    variants: [leftHand, fist, ok, wave]
}

interface Bone{
    id: number,
    variants: string[]
}

export interface Avatar{
    head: Bone,
    rightHand: Bone,
    leftHand: Bone
}

//for profile page, vb1 is 250, vb2 is 170, width is 390 and height is 300
export const Stand = ({
    vb1 = 250,
    vb2 = 170,
    width = 390,
    height= 300
}) => {
    return(
        <svg viewBox={`0 0 ${vb1} ${vb2}`} width={width} height={height} preserveAspectRatio="xMidYMid meet"> 
          
          <motion.g>
            <image href={torso} width="50" x="60" y="40" height="120"/>
            <image href={headVariants.variants[0]} width="50" x="60" y="40" height="45"/>
          
          <motion.g>
            <image href={leftShoulder} width="50" x="93" y="92" height="55"/>
                <motion.g>
                    <image href={leftArm} width="50" x="95" y="117" height="25"/>
                        <motion.g>
                            <image href={leftHand} width="50" x="94" y="131" height="17"/>
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
    );
}
