import React from "react"

import { Card } from '@/components/ui/card'

interface PopupProps {
    isOpen: boolean;
    children?: React.ReactNode;
    onClose: ()=> void;
    title: string;
    subtitle: string;
    image?: string;
}


const Popup: React.FC<PopupProps> = ({ isOpen, onClose,  children, title, subtitle, image }) => {


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50  bg-black/50 flex items-center justify-center  ">
            <img src={image} alt='robot-background' className='absolute h-[80%] top-0' />
            <div className="relative w-[50%] h-[4rem] top-[-6rem] ">

                <Card className="bg-secondary h-[35rem] w-[100%] rounded-3xl  text-center flex items-center absolute">
                    <h1 className="text-[3rem] heading text-secondary-text font-extrabold">
                        {title}
                    </h1>
                    <h2 className="text-[24rem] font-heading text-md text-secondary-text text-center justify-center">
                        {subtitle}
                    </h2>

                    <div className=" grid grid-flow-col grid-cols-2 gap-7  h-[35%]">
                        {children}
                    </div>
                    <div className="text-[2.3rem] text-black heading font-extrabold underline mt-[4%] rounded-3xl hover:bg-primary hover:text-secondary hover:font-normal w-[80%] "
                        onClick={onClose}

                        onKeyDown={(e) => {
                            if (e.key === 'Esc') {
                                 onClose();
                            }
                        }}
                    >Cancel
                    </div>
                </Card>
            </div>
        </div>
    );

};


export default Popup;