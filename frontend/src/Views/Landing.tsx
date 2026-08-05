import { Rocket, Swords, Trophy, Calculator, Code2, ChartNoAxesColumn, Medal, History, Globe, CircleCheck, Palette, BookOpen, HelpCircle } from "lucide-react";
import React from "react";
import { Link } from "react-router";
import { docs } from "src/Models/LandingModel";

import symbolBackground from '../assets/Background/SymbolBackground.png';
import helloRobot from '../assets/Robots/HelloRobot_Pink.png';
import { LandingViewModelFunction } from "../ViewModels/LandingViewModel";


const Landing:React.FC = ()=>{
    const {
        scrollY, stats, steps,
        features, audience,
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

    const docIcons = {
        palette: Palette,
        book: BookOpen,
        help: HelpCircle,
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

                <div style={{display: "flex", alignItems: "center", gap: "3rem"}}>
                    <a href="#home">Home</a>
                    <a href="#how-it-works">How it Works</a>
                    <a href="#features">Features</a>
                    <a href="#audience">Who it's For</a>
                    <a href="#documentation">Documentation</a>
                </div>
            </nav>

            {/*Hero img */}
            <section id = "home" className="relative min-h-screen flex items-center px-[8%] overflow-hidden"
                style={{background: 'radial-gradient(circle at 88% 88%, #B91551 0%, #850F3B 20%, #630B3C 30%, #530A24 38%)' }}>
                <img src= {symbolBackground} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none"/>
                
                <div className="relative z-10 flex flex-col gap-6 w-1/2">
                    <div style={{
                        display: "inline-block", background: "rgba(192, 57, 90, 0.2)", border: "1px solid rgba(192, 57, 90, 0.4)",
                        borderRadius: "20px", padding: "4px 14px", width: "fit-content", color: "var(--primary)", fontSize: "1rem", fontWeight: 700,
                        letterSpacing: "0.1rem", textTransform: "uppercase",}}>
                        Competitive - Coding - Mathematics
                    </div>
                    <h1 style={{fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 900, lineHeight: 1.05, margin: 0,}}>Code.
                        <br/> Calculate. <br/>
                        <span style={{color: "var(--primary)"}}>Conquer.</span>
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
                            background: "#fcecdd", color: "#9d2644", border: "1px solid rgba(252, 236, 221, 0.25)", padding: "12px 24px", borderRadius: "20px", textDecoration: "none", fontWeight: 800, transition: "all 0.2s ease"}}>
                            Already have an account
                        </Link>
                    </div>
                </div>

                <div className="relative z-10 w-1/2 flex items-center justify-center">
                <div style={{position: "absolute", width: "90%", aspectRatio: "1", borderRadius: "50%", background: "radial-gradient(circle, #3d0818, 0%, #2e0613, transparent 70%"}}>
                    <img src = {helloRobot} alt = "Robot" className="relative select-none pointer-events-none" style={{width: "88%", maxWidth: "650px", height: "auto", transform: "translateX(20px) translateY(30px),", zIndex: 1}}/>
                </div>
                </div>
            </section>

            {/*Stats for game */}
            <section id = "stats" style={{background: "#530a24", padding: "2rem 8%"}}>
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
            <section id="how-it-works" style={{padding: "6rem 8%", background: "var(--background)"}}>
                <div style={{textAlign: "center", marginBottom: "4rem"}}>
                    <p style={{color: "var(--primary)", letterSpacing: "0.15rem", textTransform: "uppercase", fontSize: "0.75rem"}}>How it works</p>
                    <h2 style={{fontWeight: 900, fontSize: "clamp(1.8rem, 4vw, 2.8rem)"}}>Three steps to the CodeClash Arena</h2>
                </div>
                <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2rem"}}>
                    {steps.map((step) => {
                        const Icon = stepIcons[step.icon];
                        return (
                            <div key = {step.step} style={{background: "var(--background-card)", borderRadius: 20, padding: "2rem"}}>
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
            <section id="features" style = {{padding: "6 rem 8%", background: "linear-gradient(to bottom, #0a0008, #1a0610"}}>
                <div style={{textAlign: "center", marginBottom: "4rem"}}>
                    <p style={{ color: "var(--primary)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.15rem", textTransform: "uppercase", marginBottom: "0.75rem"}}>Features</p>
                    <h2 style={{fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, color: "var(--primary-text)", margin: 0}}>Built for competitors</h2>
                </div>
                <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "1.5rem"}}>
                    {features.map((feature) => {
                        const Icon = featureIcons[feature.icon];
                        return (
                            <div key = {feature.title} style={{background: "var(--background-card)", border: "1px solid rgba(252, 235, 221, 0.07)", borderRadius: "18px", padding: "1.75rem", transition: "0.25"}}>
                                <Icon size = {34} color = "#c0395a" style={{marginBottom: "1rem"}}/>
                                <h3 style={{color: "var(--primary-text)", fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.75rem"}}>{feature.title}</h3>
                                <p style={{color: "rgba(252, 236, 221, 0.55)", lineHeight: 1.7, margin: 0}}>{feature.desc}</p>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/*Who the game is for - audience */}
            <section id="audience" style = {{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center"}}>
                <div>
                    <p style={{color: "rgba(252, 236, 221, 0.55)", fontSize: "1rem", fontWeight: 600, margin: "1rem 1.5rem", letterSpacing: "0.15rem", textTransform: "uppercase"}}>Who It's For</p>
                    <h2 style={{fontSize: "clamp(2rem, 3vw, 2.7rem)", fontWeight: 900, lineHeight: 1.15, margin: "1rem 1.5rem", color: "var(--primary-text)"}}>For students who want <br/>to win, not just pass</h2>
                    <p style={{color: "var(--muted)", lineHeight: 1.8, marginBottom: "2rem", margin: "1rem 1.5rem"}}>CodeClash is build for beginners and early career developers where math and programming practice sessions become a competitive match against another player.</p>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        {audience.map((item) => (
                            <div key = {item} style={{display: "flex", gap: "10px", alignItems: "flex-start"}}>
                                <CircleCheck size = {18} color= "#c0295a" strokeWidth={2.5} style={{marginTop: "2px", flexShrink: 0 ,margin: "1rem 1.5rem"}}/>
                                <span style={{color: "rgba(252, 236, 221, 0.72)", lineHeight: 1.5, margin: "0.6rem", gap: "1px"}}>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/*for docs*/}
            <section id="documentation" style={{padding: "6rem 8%", background: "var(--background)"}}>
                <div style={{ textAlign: "center", marginBottom: "4rem",}}>
                    <p style={{color: "var(--primary)", fontSize: "0.75rem", letterSpacing: "0.15rem", textTransform: "uppercase", fontWeight: 700}}>Documentation</p>
                    <h2 style={{color: "var(--primary-text)", fontSize: "clamp(2rem,4vw, 2.8rem", fontWeight: 900, margin: "1rem 0"}}>Learn more about CodeClash</h2>
                </div>
                <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr)", gap: "1.5rem"}}>
                    {docs.map((doc) => {
                        const Icon = docIcons[doc.icon];
                        return (
                            <Link key = {doc.title} to={doc.link} style={{textDecoration: "none"}}>
                                <div style={{background: "var(--background-card)", border: "1px solid var(--border)", borderRadius: "18px"
                                    , padding: "2rem", height: "100%", transition: "all 0.2 ease"}}>
                                        <Icon size = {34} color = "#c0395a"/>
                                        <h3 style={{color: "var(--primary-text)", marginTop: "1rem", marginBottom: "0.75rem", fontWeight: 700}}>{doc.title}</h3>
                                        <p style={{ color: "rgba(252, 236, 221, 0.55)", lineHeight: 1.7, margin: 0}}>{doc.desc}</p>
                                    </div>
                            </Link>
                        )
                    })}
                </div>
            </section>

            <section id="get-started" style={{position: "relative", padding:"8rem 8% ", textAlign: "center", background: "radial-gradient(circle at center, #530a24 0%, #01008 70%", overflow: "hidden"}}>
                <img src= {symbolBackground} alt= "" style={{position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none"}}/>
                <div style={{position: "relative", zIndex: 1}}>
                    <h2 style={{fontSize: "clamp(2.2rem, 5vw, 3.6rem)", fontWeight: 900, color: "var(--primary-text)", lineHeight: 1.1, marginBottom: "1.5rem"}}>Ready to enter <br/>
                    <span style={{color: "var(--primary)"}}>the CodeClash Arena?</span>
                    </h2>
                    {/*copied from buttons above */}
                    <div style={{display: "flex", justifyContent: "center", gap: "18px", flexWrap: "wrap"}}>
                        <Link to="/sign-up" style={{
                            background: "#c0395a", color: "#fffff", textAlign: "center", padding: "15px 60px", borderRadius: "20px", textDecoration: "none", fontWeight: 800, fontSize: "0.95rem", boxShadow: "0 4px 20px rgba(192, 57, 90, 0.35)", transition: "all 0.2s ease"}}>
                            Start Competing
                        </Link>
                        {/*copied link above */}
                        <Link to="/sign-in" style={{
                            background: "#fcecdd", color: "#9d2644", border: "1px solid rgba(252, 236, 221, 0.25)", padding: "15px 60px", borderRadius: "20px", textDecoration: "none", fontWeight: 800, transition: "all 0.2s ease"}}>
                            Already have an account
                        </Link>
                    </div>
                </div>
            </section>

            {/*CLosing footer */}
            <footer style={{background: "var(--background)", borderTop: "1px solid rgba(252, 235, 221, 0.08)", padding: "2rem 8%"}}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem"}}>
                    <div>
                        <span style={{fontSize: "1.3rem", fontWeight: 900, color: "var(--primary-text)", letterSpacing: '0.05rem'}}>CODE
                            <span style={{color: "var(--primary)"}}>CLASH</span>
                        </span>
                        < p style={{color: "rgba(252,236, 221, 0.35)", marginTop: "0.5rem", fontSize: "0.9rem"}}>Competitive Programming & Mathematic Battles</p>
                    </div>
                    <p style={{color: "var(--primary-text)", fontSize: "0.9rem ", margin: 0, textAlign: "right"}}>2026 CodeClash - QuantDevs</p>
                </div>
            </footer>
        </div>
    )
}
export default Landing;