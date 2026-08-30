import {motion} from 'framer-motion';
import angry from "../svgs/angry.svg"
import antenna from "../svgs/antenna.svg"
import celebrate from "../svgs/celebrate.svg"
import confused from "../svgs/confused.svg"
import excited from "../svgs/excited.svg"
import fist from "../svgs/fist.svg"
import happy from "../svgs/happy.svg"
import head from "../svgs/head.svg"
import leftArm from "../svgs/left-arm.svg"
import leftHand from "../svgs/left-hand.svg"
import leftLeg from "../svgs/left-leg.svg"
import losing from "../svgs/losing.svg"
import neutral from "../svgs/neutral.svg"
import ok from "../svgs/ok.svg"
import peace from "../svgs/peace.svg"
import rightArm from "../svgs/right-arm.svg"
import rightHand from "../svgs/left-hand.svg"
import rightLeg from "../svgs/right-leg.svg"
import sad from "../svgs/sad.svg"
import surprised from "../svgs/surprised.svg"
import thinkingHand from "../svgs/thinking-hand.svg"
import thinking from "../svgs/thinking.svg"
import torso from "../svgs/torso.svg"
import wave from "../svgs/wave.svg"
import wink from "../svgs/wink.svg"
import winning from "../svgs/winning.svg"
import worried from "../svgs/worried.svg"
import wrong from "../svgs/wrong.svg"
import { headVariants } from "./rig";
import { leftHandVariants } from "./rig";
import { rightHandVariants } from "./rig";


export const fistBump = () => {
    return(
        <svg viewBox="0 0 100 100" width="400" height="300">
        
        <motion.g>
            <image href={rightLeg} width="30%" x="-3%" y="62%" height="30%"/>
        </motion.g>
        <motion.g>
            <image href={leftLeg} width="30%" x="15%" y="62%" height="30%"/>
        </motion.g>
        <motion.g>
            <image href={rightArm} width="30%" x="-11%" y="44%" height="30%"/>
        </motion.g>
        <motion.g>
            <image href={leftArm} width="30%" x="23%" y="44%" height="30%"/>
        </motion.g>
        <motion.g>
            <image href={torso} width="30%" x="6%" y="34%" height="30%"/>
        </motion.g>
        </svg>
    );
}