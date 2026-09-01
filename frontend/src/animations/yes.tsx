import {motion, useMotionValue, animate} from 'framer-motion';
import {useRef, useEffect} from "react";
import angry from "../svgs/angry.svg"
import antenna from "../svgs/antenna.svg"
import celebrate from "../svgs/celebrate.svg"
import confused from "../svgs/confused.svg"
import excited from "../svgs/excited.svg"
import fist from "../svgs/fist.svg"
import happy from "../svgs/happy.svg"
import head from "../svgs/head.svg"
import leftShoulder from "../svgs/left-shoulder.svg"
import leftArm from "../svgs/left-forearm.svg"
import leftHand from "../svgs/left-hand.svg"
import leftLeg from "../svgs/left-leg.svg"
import losing from "../svgs/losing.svg"
import neutral from "../svgs/neutral.svg"
import ok from "../svgs/ok.svg"
import peace from "../svgs/peace.svg"
import rightShoulder from "../svgs/right-shoulder.svg"
import rightArm from "../svgs/right-forearm.svg"
import rightHand from "../svgs/right-hand.svg"
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


// export const FistBump = () => {
//     return(
//         <div className="bg-[#000000] min-h-screen w-full">
//         <svg viewBox="0 0 100 100" width="400" height="300">
        
//         <motion.g>
//             <image href={rightLeg} width="30%" x="-3%" y="62%" height="30%"/>
//         </motion.g>
//         <motion.g>
//             <image href={leftLeg} width="30%" x="15%" y="62%" height="30%"/>
//         </motion.g>
//         <motion.g>
//             <image href={rightArm} width="30%" x="-11%" y="44%" height="25%"/>
//         </motion.g>
//         <motion.g>
//             <image href={leftArm} width="30%" x="23%" y="44%" height="25%"/>
//         </motion.g>
//         <motion.g>
//             <image href={torso} width="30%" x="6%" y="34%" height="30%"/>
//         </motion.g>
//         <motion.g>
//             <image href={excited} width="30%" x="6%" y="12%" height="30%"/>
//         </motion.g>
//         <motion.g>
//             <image href={rightHand} width="30%" x="-10.5%" y="63%" height="10%"/>
//         </motion.g>
//         <motion.g
//             transition={{duration: 0.6}}>
//             <image href={leftHand} width="30%" x="22.5%" y="63%" height="10%"/>
//             <motion.path
//             d="M20,100 Q100,20 180,100"
//             initial={{pathLength: 0}}
//             animate={{pathLength: 1}}
//             transition={{}}/>
//         </motion.g>
//         </svg>
//         </div>
//     );
// }

export const Yes = () => {

    return(
        <svg viewBox="0 0 300 400" width="600" height="700" preserveAspectRatio="xMidYMid meet">

            
            <image href={torso} width="50" x="60" y="40" height="120"/>
            <image href={excited} width="50" x="60" y="40" height="45"/>

            <motion.g>
                <image href={rightLeg} width="50" x="40" y="122" height="57"/>
                <image href={leftLeg} width="50" x="80" y="122" height="57"/>
                <image href={rightShoulder} width="50" x="28" y="92" height="55"/>
                <image href={rightArm} width="50" x="26" y="117" height="25"/>
                <image href={rightHand} width="50" x="27" y="132" height="17"/>
            </motion.g>


            <motion.g
                style={{originX: "115px", originY: "100px", transformBox: "view-box"}}
                animate={{rotate: -5}}
                transition={{
                    type: "spring",
                    delay: 0.1,
                }}
                >

                <image href={leftShoulder} width="50" x="93" y="92" height="55"/>

                <motion.g
                    style={{originX: "123px", originY: "117px", transformBox: "view-box"}}
                    animate={{rotate: 150}}
                    >
                    <image href={leftArm} width="50" x="95" y="117" height="25"/>

                    <motion.g
                    animate={{rotate: 5}}
                    transition={{
                        delay: 0.4,
                        duration: 0.4
                    }}
                    >
                        
                        <image href={leftHand} width="50" x="92" y="130" height="17"/>
                    </motion.g>
                </motion.g>
            </motion.g>
        </svg>
    )
}



// function Path(){
//     const pathRef = useRef(null);
//     const progress = useMotionValue(0);
//     const x = useMotionValue(0);
//     const y = useMotionValue(0);

//     useEffect(() => {
//         const path = pathRef.current;
//         const length = path.getTotalLength();

//         const unsubscribe = progress.on("change", (latest) => {
//             const point = path.getPointAtLength(latest * length);
//             x.set(point.x);
//             y.set(point.y);

//         });


//         const controls = animate(progress, 1, {
//             duration: 3,
//             ease: "easeInOut",
//             repeat: Infinity,
//             repeatType: "loop"
//         });


//         return () => {
//             unsubscribe();
//             controls.stop();
//         };
//     }, []);

//     return(
//         <svg viewBox="0 0 200 200" width={300} height={300}>
//             <path
//             ref={pathRef}
//             d="M20,100 Q100,20 180,100 Q100,180 20,100"
//             fill="none"
//             stroke="#ccc"
//             strokeWidth={1}/>

//             <motion.image
//             href={leftArm}
//             width={20}
//             height={20}
//             style={{
//                 x,
//                 y,
//                 translateX: -10,
//                 translateY: -10,
//             }}/>
//         </svg>
//     );
// }