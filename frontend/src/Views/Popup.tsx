import '../styles/global.css'
import React from "react"
import { useNavigate } from 'react-router-dom';

import robot from '../assets/Robots/arms_up.png'
import { type PopupProps } from '../Models/PopUpModel';
import { useSelectTopic } from '../ViewModels/PopUpViewModel';

import { Card } from '@/components/ui/card'
import type { GameMode } from 'src/dtos/matchmaking.dto';


const Popup: React.FC<PopupProps> = ({ isOpen, onClose }) => {
    const { selectTopic, cancel } = useSelectTopic();
    const nav = useNavigate();

    const selecthandler = (t: GameMode) => {
        if (selectTopic === null || t === null)
            nav('/error')
        else {
            selectTopic(t)
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50  bg-black/50 flex items-center justify-center  ">
            <img src={robot} alt='robot-background' className='absolute h-[80%] top-0' />
            <div className="relative w-[50%] h-[4rem] top-[-6rem] ">

                <Card className="bg-secondary h-[35rem] w-[100%] rounded-3xl  text-center flex items-center absolute">
                    <h1 className="text-[64px] heading text-secondary-text font-extrabold">
                        Choose a Topic
                    </h1>
                    <h2 className="text-[24rem] font-heading text-md text-secondary-text text-center justify-center">What would you like to be challenged on?</h2>

                    <div className=" grid grid-flow-col grid-cols-2 gap-7  h-[35%]">
                        <Card className="group w-[18rem] bg-secondary text-secondary-text transition-all duration-200 hover:bg-primary hover:-translate-y-px active:translate-y-0"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                const shift = e.shiftKey;
                                if (shift && e.key === 'L') {
                                    selecthandler('math')
                                }
                            }}
                            onClick={() => selecthandler('math')}
                            aria-label='math-selector'
                        >
                            <h1 className="text-[3rem] text-secondary-text heading font-bold  group-hover:text-white">+ -</h1>
                            <h2 className="text-[2.1rem] text-secondary-text heading font-bold  group-hover:text-white">Math</h2>
                        </Card>
                        <Card className="group w-[18rem] bg-secondary text-secondary-text transition-all duration-200 hover:bg-primary hover:-translate-y-px active:translate-y-0"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                const shift = e.shiftKey;
                                if (shift && e.key === 'R') {
                                    selecthandler('programming')
                                }
                            }}
                            onClick={() => selecthandler('programming')}
                            aria-label='prog-selector'
                        >
                            <h1 className="text-[3rem] text-secondary-text heading font-bold group-hover:text-white">{"</>"}</h1>
                            <h2 className="text-[2.1rem] text-secondary-text heading font-bold group-hover:text-white">Programming</h2>
                        </Card>
                    </div>
                    <div className="text-[2.3rem] text-black heading font-extrabold underline mt-[4%] rounded-3xl hover:bg-primary hover:text-secondary hover:font-normal w-[80%] "
                        onClick={() => {
                            cancel();
                            onClose()
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                                onClose();
                                cancel()
                            }
                        }}
                        aria-label='cancel'
                    >Cancel
                    </div>
                </Card>
            </div>
        </div>
    );

};


export default Popup;