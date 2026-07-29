import React, {useState, useEffect} from "react";
import { Link } from "react-router";
import { LandingViewModelFunction } from "../ViewModels/LandingViewModel";
import { Rocket, Swords, Trophy, Calculator, Code2, ChartNoAxesColumn, Medal, History, Globe } from "lucide-react";
import symbolBackground from '../assets/Background/SymbolBackground.png';
import helloRobot from '../assets/Robots/HelloRobot_Pink.png';

const Landing:React.FC = ()=>{
    const {
        scrollY, stats, steps,
        features, audience, players,
    } = LandingViewModelFunction();

    const stepIcons = {
        rocket: Rocket,
        swords: Swords,
        trophy: Trophy,
    }

    const featureIcons = {
        calculator: Calculator,
        code: Code2,
        chart: ChartNoAxesColumn,
        medal: Medal,
        history: History,
        globe: Globe,
    }

    return (
        <div className="min-h-screen w-full bg-[#0a0008] text-[#fcecdd] overflow-hidden"
            style={{fontFamily: "Roboto, sans-serif"}}>
            
            {/*landing page navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
                style={{background: scrollY > 50 ? "rgba(10,0,8,0.95)" : "transparent", backdropFilter: scrollY > 50 ? "blur(12px)" : "none", transition: "background 0.3s ease", borderBottom: scrollY > 50 ? "1px solid rgba(252, 236, 221, 0.08)": "none",}}>
                <span style={{color: '#fcecdd', fontWeight: 900, fontSize: "1.2rem", letterSpacing: "0.05rem",}}>CODE
                    <span style={{color: '#c0395a', fontWeight: 900, fontSize: "1.2rem", letterSpacing: "0.05rem"}}>CLASH</span>
                </span>

                <div className="flex items-center gap-4">
                    <Link to='/sign-in' style={{color: '#fcecdd', fontSize: "1rem", fontWeight: 900, textDecoration: "none"}} onMouseEnter={(e) => {e.currentTarget.style.color = '#fcecdd'}} onMouseLeave={(e) => {e.currentTarget.style.color = 'rgba(252, 236, 221, 0.7)'}}>
                        Sign in
                    </Link>
                    <Link to='/sign-up' style={{color: '#ffffff', fontSize: "1rem", fontWeight: 900, textDecoration: "none"}} onMouseEnter={(e) => {e.currentTarget.style.color = '#fcecdd'}} onMouseLeave={(e) => {e.currentTarget.style.color = 'rgba(252, 236, 221, 0.7)'}}>
                        Get started
                    </Link>
                </div>
            </nav>

            {/*Hero img */}
            <section className="relative min-h-screen flex items-center px-[8%] overflow-hidden"
                style={{background: 'radial-gradient(circle at 88% 88%, #B91551 0%, #850F3B 20%, #630B3C 30%, #530A24 38%)' }}>
                <img src= {symbolBackground} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none"/>
                
                <div className="relative z-10 flex flex-col gap-6 w-1/2">
                    <div style={{
                        display: "inline-block", background: "rgba(192, 57, 90, 0.2)", border: "1px solid rgba(192, 57, 90, 0.4)",
                        borderRadius: "20px", padding: "4px 14px", width: "fit-content", color: "#c0395a", fontSize: "1rem", fontWeight: 700,
                        letterSpacing: "0.1rem", textTransform: "uppercase",}}>
                        Competitive - Coding - Mathematics
                    </div>
                    <h1 style={{fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 900, lineHeight: 1.05, margin: 0,}}>Code.
                        <br/> Calculate. <br/>
                        <span style={{color: "#c0395a"}}>Conquer.</span>
                    </h1>
                    <p style={{color: "#ffffff", maxWidth: 420, lineHeight: 2, fontSize: "1rem"}}>
                        Battle opponents in real-time coding and mathematics challenges. Climb the leaderboard. Earn your rank. 
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                        <Link to="/sign-up" style={{
                            background: "#c0395a", color: "#fffff", textAlign: "center", padding: "12px 24px", borderRadius: "20px", textDecoration: "none", fontWeight: 800, fontSize: "0.95rem", boxShadow: "0 4px 20px rgba(192, 57, 90, 0.35)", transition: "all 0.2s ease"}}>
                            Start Competing
                        </Link>
                        {/*copied link above */}
                        <Link to="/sign-in" style={{
                            background: "transparent", color: "#fcecdd", border: "1px solid rgba(252, 236, 221, 0.25)", padding: "12px 24px", borderRadius: "20px", textDecoration: "none", fontWeight: 800, transition: "all 0.2s ease"}}>
                            Already have an account
                        </Link>
                    </div>
                </div>

                <div className="relative z-10 w-1/2 flex items-center justify-center">
                <div style={{position: "absolute", width: "90%", aspectRatio: "1", borderRadius: "50%", background: "radial-gradient(circle, #3d0818, 0%, #2e0613, transparent 70%"}}>
                    <img src = {helloRobot} alt = "Robot" className="relative select-none pointer-events-none" style={{width: "90%",maxWidth: "650px", height: "auto", transform: "translateX(20px) translateY(30px),", zIndex: 1}}/>
                </div>
                </div>
            </section>

            {/*Stats for game */}
            <section style={{background: "#530a24", padding: "2rem 8%"}}>
                <div className="flex justify-around lfex-wrap gap-8">
                    {stats.map((stat) => (
                        <div key = {stat.label} style={{textAlign: "center"}}>
                            <p style={{fontSize: "2rem", fontWeight: 900, margin: 0}}>{stat.value}</p>
                            <p style={{color: "#rgba(252, 236, 221, 0.5", textTransform: "uppercase", fontSize: "0.75rem"}}>{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/*How the game works */}
            <section style={{padding: "6rem 8%", background: "#0a0008"}}>
                <div style={{textAlign: "center", marginBottom: "4rem"}}>
                    <p style={{color: "#c0395a", letterSpacing: "0.15rem", textTransform: "uppercase", fontSize: "0.75rem"}}>How it works</p>
                    <h2 style={{fontWeight: 900, fontSize: "clamp(1.8rem, 4vw, 2.8rem)"}}>Three steps to the CodeClash Arena</h2>
                </div>
                <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2rem"}}>
                    {steps.map((step) => {
                        const Icon = stepIcons[step.icon];
                        return (
                            <div key = {step.step} style={{background: "rgba(252, 236, 221, 0.08)", borderRadius: 20, padding: "2rem"}}>
                                <div className="flex items-center gap-4 mb-4">
                                    <Icon size = {34} color = "#c0395a"/>
                                    <span style={{color: "rgba(192, 57,90, 0.6)", fontSize: "0.7rem", fontWeight: 700}}>{step.step}</span>
                                </div>
                                    <h3>{step.title}</h3>
                                    <p style={{color: "rgba(252, 236, 221, 0.55)", lineHeight: 1.7}}>{step.desc}</p>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/*Features of the game */}
            <section style = {{padding: "6 rem 8%", background: "linear-gradient(to bottom, #0a0008, #1a0610"}}>
                <div style={{textAlign: "center", marginBottom: "4rem"}}>
                    <p style={{ color: "#c0395a", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.15rem", textTransform: "uppercase", marginBottom: "0.75rem"}}>Features</p>
                    <h2 style={{fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, color: "#fcecdd", margin: 0}}>Built for competitors</h2>
                </div>
                <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "1.5rem"}}>
                    {features.map((feature) => {
                        const Icon = featureIcons[feature.icon];
                        return (
                            <div key = {feature.title} style={{background: "rgba(252, 236, 221, 0.03)", border: "1px solid rgba(252, 235, 221, 0.07)", borderRadius: "18px", padding: "1.75rem", transition: "0.25"}}>
                                <Icon size = {34} color = "#c0395a" style={{marginBottom: "1rem"}}/>
                                <h3 style={{color: "#fcecdd", fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.75rem"}}>{feature.title}</h3>
                                <p style={{color: "rgba(252, 236, 221, 0.55)", lineHeight: 1.7, margin: 0}}>{feature.desc}</p>
                            </div>
                        )
                    })}
                </div>
            </section>
        </div>
    )
}
export default Landing;