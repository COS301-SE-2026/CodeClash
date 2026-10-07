import React from "react";
import Starfield from "@/components/ui/animations/Starfield";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import bg from "../../../src/assets/Background/solar_system.jpg"

type Tutorial = {
    title: string;
    src: string;
    description?: string;
}

const tutorial: Tutorial[] = [
    {
        title: "1. How to play a competitive match",
        src: '',
        description: ''
    },
    {
        title: "2. How to view the results and statistics of your match",
        src: '',
        description: ''
    },
    {
        title: "3. How to play in or host a tournament",
        src: '',
        description: ''
    }
]

const Tutorials: React.FC = () => {
    return (
        <div style={{backgroundImage: `url(${bg})`}} className="relative w-full min-h-screen bg-cover bg-center overflow-hidden p-8">
            <div className="absolute inset-0 bg-background/75"/>
            <Starfield/>
            <Link to="/help-menu" className="btn btn-ghost primary-back-button">
                <ArrowLeft size={18}/>Back
            </Link>
            <div className="relative z-10 max-w-[1100px] mx-auto flex flex-col gap-10 pb-10">
                <div className="items-center flex flex-col gap-4 pt-13">
                    <h1 className="text-xl font-black text-primary-text mb-3">CodeClash Tutorials</h1>
                    <p className="text-muted text-xsm leading-relaxed">Browse our tutorials and learn how to play.</p>
                </div>

                {tutorial.length === 0 ? (
                    <p className="text-muted text-sm text-center">No tutorials yet. Check back soon!</p>
                ) : (
                    <div className="flex flex-col gap-12">
                        {tutorial.map((tut, i) => (
                            <section key={tut.title} className="flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <h2 className="section-title text-sm">{tut.title}</h2>
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
export default Tutorials;