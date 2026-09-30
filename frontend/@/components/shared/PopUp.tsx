import React from "react"
import { Spinner } from "@/components/ui/spinner";
import { Card } from '@/components/ui/card'

interface PopupProps {
    isOpen: boolean;
    title: string;
    subtitle: string;
}


const Popup: React.FC<PopupProps> = ({ isOpen, title, subtitle}) => {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50  bg-background/60 flex items-center justify-center p-4 ">

            <Card className="relative w-full max-w-lg rounded-3xl  text-center flex flex-col items-center gap-4 p-8 overflow-hidden"
                style={{ background: 'radial-gradient(circle at 50% 15%, #b91551 0%, #850f3b 22%, #630b3c 34%, #0a0008 62%)' }}>
                <h1 className="text-md text-primary-text font-extrabold whitespace-nowrap">
                    {title}
                </h1>
                <h2 className="text-sm text-primary-text/80 text-center">
                    {subtitle}
                </h2>
                <Spinner className='w-12 h-12 text-secondary'></Spinner>
            </Card>
        </div>
    );

};


export default Popup;