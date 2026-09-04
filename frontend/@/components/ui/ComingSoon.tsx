//This will be a coming soon page to be used for our wow factors that arent implemented yet - its just so that when user clicks tournaments for example, its not blank

import { Telescope} from "lucide-react";
import React from "react";

type ComingSoonProps = {
    title?: string;
    description?: string;
    icon?: React.ComponentType<{size?: number; classname?: string}>;
    fullscreen?: boolean;
};

const ComingSoon = ({
    title = "Coming Soon!",
    description = "This feature is still being built by the CodeClash engineers.",
    icon: Icon = Telescope,
    fullscreen = true
}: ComingSoonProps) => {
    return (
        <div className={`relative ${fullscreen? 'min-h-screen' : 'h-full mt-28'} flex items-center justify-center overflow-hidden`}>
            <div className="relative z-10 flex flex-col items-center text-center gap-6 mx-w-md">
                <div className="relative flex items-center justify-center">
                    <div className="absolute w-40 h-40 rounded-full animate-glow"
                        style={{background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)"}}/>
                    <div className="relative w-24 h-24 rounded-full border-2 border-primary bg-card flex items-center justify-center">
                        <Icon size={40} classname="text-primary"/>
                    </div>
                </div>

                <div>
                    <h1 className="text-l font-black text-primary-text mb-3">{title}</h1>
                    <p className="text-muted text-xsm leading-relaxed">{description}</p>
                </div>
            </div>
        </div>
    )
}

export default ComingSoon;