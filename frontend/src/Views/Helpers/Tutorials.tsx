import React from "react";
import Starfield from "@/components/ui/animations/Starfield";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import bg from "../../../src/assets/Background/solar_system.jpg"
import vid1 from "src/assets/Tutorials/Tut_Vid_1.mp4"
import vid2 from "src/assets/Tutorials/Tut_Vid_2.mp4"
import vid3 from "src/assets/Tutorials/Tut_Vid_3.mp4"

type Tutorial = {
    title: string;
    src: string;
    description?: string;
    poster?: string; //thumbnail if we want
}

const tutorial: Tutorial[] = [
    {
        title: "1. Navigate to a match",
        src: vid1,
        description: 'Getting Started with CodeClash? Here\'s how to create an account and get right into improving your Maths and Programming skills by queuing up for and entering a ranked PvP match.',
        poster: ''
    },
    {
        title: "2. View the results and statistics of your recently played match",
        src: vid2,
        description: 'Here is how to view your match results, history and any achievements you may have earned during a match.',
        poster: ''
    },
    {
        title: "3. Play in or host a tournament",
        src: vid3,
        description: 'So you want to play in a tournament? Here is how to start or join one.',
        poster: ''
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
                        {tutorial.map((tut) => (
                            <section key={tut.title} className="flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <h2 className="section-title text-sm">{tut.title}</h2>
                                </div>

                                <div className="w-[50%] aspect-video overflow-hidden rounded-[18px] border border-border bg-background-card">
                                    <video src={tut.src} poster={tut.poster} controls preload="metadata" className="w-full h-full"/>
                                </div>

                                {tut.description && (
                                    <p className="section-description text-xsm">{tut.description}</p>
                                )}
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
export default Tutorials;