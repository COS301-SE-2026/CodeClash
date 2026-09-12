import '../styles/global.css'
import React from "react"
import { useNavigate } from 'react-router-dom';
import type { GameMode } from 'src/dtos/matchmaking.dto';

import { type PopupProps } from '../Models/PopUpModel';
import { useSelectTopic } from '../ViewModels/PopUpViewModel';
import { Yes } from 'src/animations/yes';

import { Card } from '@/components/ui/card'


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
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 ">
            {/* <img src={robot} alt='robot-background' className='absolute h-[80%] top-0' /> */}
           
            <div className="absolute h-full w-full top-[-6rem] left-[11.5rem] items-center justify-center">
                <Yes/> 
            </div>
            <div className="relative w-[60%] h-[2rem] top-[-2rem] ">

                <Card className="bg-sidebar card-glow h-[18rem] w-[100%] rounded-2xl text-center flex items-center absolute inset-0">
                    <h1 className="text-l heading text-primary-text font-extrabold">
                        Choose a Topic
                    </h1>
                    <h2 className="text-sm font-heading text-muted-text text-center justify-center">What would you like to be challenged on?</h2>

                    <div className=" grid grid-flow-col grid-cols-2 gap-7 h-[20%]">
                        <Card className=" btn btn-primary w-full"
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
                            <h1 className="text-sm text-primary-text font-bold group-hover:text-white">Math</h1>
                        </Card>
                        <Card className="btn btn-primary w-full"
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
                            <h1 className="text-sm text-primary-text font-bold">Programming</h1>
                        </Card>
                    </div>
                    <div className="text-sm text-primary-text heading font-extrabold underline mt-[0%] rounded-2xl w-[20%] hover:text-primary"
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