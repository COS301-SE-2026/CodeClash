import '../styles/global.css'
import React from "react"
import robot from '../assets/Robots/arms_up.png'
import { Card } from '@/components/ui/card'
import { Link } from 'react-router-dom';

const Popup: React.FC = () => {

    return (
        <div  className="min-h-screen w-full bg-[var(--secondary)] flex items-center justify-center  bg-center bg-no-repeat bg-size-[auto_800px]">
            <img src={robot} alt='robot-background' className='absolute h-[80%] top-[3rem]'/>
            <div className="relative w-xl mb-[3%] top-[-2rem] ">

                <Card className="bg-secondary h-[35rem] w-[100%] rounded-3xl pt-12 pb-8 text-center flex items-center absolute">
                    <h1 className="text-[64px] heading text-secondary-text font-extrabold mt-3">
                        Choose a Topic
                    </h1>
                    <h2 className="text-[24rem] font-heading text-md text-secondary-text text-center justify-center mt-2">What would you like to be challenged on?</h2>

                    <div className=" grid grid-flow-col grid-cols-2 gap-7 ml-[3%] mr-[3%]  h-45">
                        <Card className="group w-[15rem] bg-secondary text-secondary-text transition-all duration-200 hover:bg-primary hover:-translate-y-px active:translate-y-0"
                            onKeyDown={(e) => {
                                const shift = e.shiftKey;
                                if (shift && e.key === 'L') {

                                }
                            }}>
                            <h1 className="text-[3rem] text-secondary-text heading font-bold  group-hover:text-white">+ -</h1>
                            <h2 className="text-[2.1rem] text-secondary-text heading font-bold  group-hover:text-white">Math</h2>
                        </Card>
                        <Card className="group w-[15rem] bg-secondary text-secondary-text transition-all duration-200 hover:bg-primary hover:-translate-y-px active:translate-y-0"
                            onKeyDown={(e) => {
                                const shift = e.shiftKey;
                                if (shift && e.key === 'R') {

                                }
                            }}>
                            <h1 className="text-[3rem] text-secondary-text heading font-bold group-hover:text-white">{"</>"}</h1>
                            <h2 className="text-[2.1rem] text-secondary-text heading font-bold group-hover:text-white">Programming</h2>
                        </Card>
                    </div>
                    <Link className="text-[2.3rem] text-black heading font-extrabold underline mt-[4%] rounded-3xl hover:bg-primary hover:text-secondary hover:font-normal w-[80%] "
                        onKeyDown={(e) => {
                            const shift = e.shiftKey;
                            if (shift && e.key === 'Esc') {

                            }
                        }}

                        to='/dashboard'
                    >Cancel
                    </Link>
                </Card>
            </div>
        </div>
    );

};


export default Popup;