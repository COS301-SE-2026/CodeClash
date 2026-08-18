//This will be a coming soon page to be used for our wow factors that arent implemented yet - its just so that when user clicks tournaments for example, its not blank

import { Telescope } from "lucide-react";
import React from "react";

type ComingSoonProps = {
    title?: string;
    description?: string;
    icon?: React.ComponentType<{size?: number; classname?: string}>;
};

const ComingSoon = ({
    title = "Coming Soon!",
    description = "This feature is still being built by the CodeClash engineers.",
    icon: Icon = Telescope,
}: ComingSoonProps) => {
    return (
        <div className="relative min-h-screen flex items-center justify-center p-8 overflow-hidden">
            <div className="relative z-10 flex flex-col items-center text-center gap-6 mx-w-md">
                <div className="relative flex items-center justify-center">
                    <div className="absolute w-40 h-40 rounded-full animate-glow"
                        style={{background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)"}}/>
                    <div className="relative w-24 h-24 rounded-full border-2 border-primary bg-card flex items-center justify-center">
                        <Icon size={40} classname="text-primary"/>
                    </div>
                </div>

                <div>
                    <h1 className="text-3xl font-black text-primart-text mb-3">{title}</h1>
                    <p className="text-muted leading-relaxed">{description}</p>
                </div>
            </div>
        </div>
    )
}

export default ComingSoon;