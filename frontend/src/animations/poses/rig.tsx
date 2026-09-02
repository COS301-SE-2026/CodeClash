import React from "react";
import {motion} from 'framer-motion';
import angry from "../../svgs/angry.svg"
import antenna from "../../svgs/antenna.svg"
import celebrate from "../../svgs/celebrate.svg"
import confused from "../../svgs/confused.svg"
import excited from "../../svgs/excited.svg"
import fist from "../../svgs/fist.svg"
import happy from "../../svgs/happy.svg"
import head from "../../svgs/head.svg"
import leftShoulder from "../../svgs/left-shoulder.svg"
import leftArm from "../../svgs/left-forearm.svg"
import leftHand from "../../svgs/left-hand.svg"
import leftLeg from "../../svgs/left-leg.svg"
import losing from "../../svgs/losing.svg"
import neutral from "../../svgs/neutral.svg"
import ok from "../../svgs/ok.svg"
import peace from "../../svgs/peace.svg"
import rightShoulder from "../../svgs/right-shoulder.svg"
import rightArm from "../../svgs/right-forearm.svg"
import rightHand from "../../svgs/left-hand.svg"
import rightLeg from "../../svgs/right-leg.svg"
import sad from "../../svgs/sad.svg"
import surprised from "../../svgs/surprised.svg"
import thinkingHand from "../../svgs/thinking-hand.svg"
import thinking from "../../svgs/thinking.svg"
import torso from "../../svgs/torso.svg"
import wave from "../../svgs/wave.svg"
import wink from "../../svgs/wink.svg"
import winning from "../../svgs/winning.svg"
import worried from "../../svgs/worried.svg"
import wrong from "../../svgs/wrong.svg"

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

export const Stand = () => {
    return(
        <svg viewBox="0 0 250 170" width="390" height="300" preserveAspectRatio="xMidYMid meet"> 
          
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
