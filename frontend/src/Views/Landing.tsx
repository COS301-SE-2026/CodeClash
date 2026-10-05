import { Rocket, Swords, Trophy, Calculator, Code2, ChartNoAxesColumn, Medal, History, Globe, CircleCheck, Palette, BookOpen, HelpCircle } from "lucide-react";
import React from "react";
import { Link } from "react-router";
import { docs } from "src/Models/LandingModel";
import { LandingViewModelFunction } from "../ViewModels/LandingViewModel";
import PlayerAvatar from "src/avatar/PlayerAvatar";


const Landing:React.FC = ()=>{
    const {
        scrollY, steps,
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
        <div className="min-h-screen w-full bg-background text-primary overflow-hidden"
            style={{fontFamily: "Roboto, sans-serif"}}>
            
            {/*landing page navigation */}
            <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 nav-bar ${scrollY > 50 ? 'scrolled' : ''} `}>
                <span style={{color: 'var(--primary)', fontWeight: 900, fontSize: "1.2rem", letterSpacing: "0.05rem",}}>CODECLASH</span>

                <div style={{display: "flex", alignItems: "center", gap: "3rem"}}>
                    <a href="#home">Home</a>
                    <a href="#how-it-works">How it Works</a>
                    <a href="#features">Features</a>
                    <a href="#audience">Who it's For</a>
                    <a href="#documentation">Documentation</a>
                </div>
               
            </nav>


            {/*Hero img */}
            <section id = "home" className="relative min-h-screen flex items-center px-[8%] overflow-hidden bg-radial-glow-corner mt-[1%]">
                <div className="relative z-10 flex flex-col flex-wrap gap-6 w-1/2">
                    <h1 style={{fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 900, lineHeight: 1.05, margin: 0,}}>Code.
                        <br/> Calculate. <br/>
                        <span>Conquer.</span>
                    </h1>
                    <p style={{color: 'var(--text)', maxWidth: 420, lineHeight: 2, fontSize: "1rem"}}>
                        Battle opponents in real-time coding and mathematics challenges. Climb the leaderboard. Earn your rank. 
                    </p>
                    <div className="flex flex-wrap items-center gap-4 mt-2">
                        <Link to="/sign-up" className="btn btn-primary">
                            Start Competing
                        </Link>
                        {/*copied link above */}
                        <Link to="/sign-in" className="btn btn-primary"  >
                            Already have an account
                        </Link>
                    </div>
                </div>

                <div className="relative z-10 w-1/2 flex items-center justify-center">
                <div className="absolute w-[120%] aspect-square rounded-full bg-radial-glow-corner">
                    <PlayerAvatar assetKey='Vexa' size={700} className="m-auto mt-15"/>
                </div>
                </div>
            </section>

            {/*How the game works */}
            <section id="how-it-works" style={{padding: "6rem 8%", background: "var(--background)"}}>
                <div style={{textAlign: "center", marginBottom: "4rem"}}>
                    <p style={{color: "var(--primary-text)", letterSpacing: "0.15rem", textTransform: "uppercase", fontSize: "0.75rem"}}>How it works</p>
                    <h2 style={{fontWeight: 900, fontSize: "clamp(1.8rem, 4vw, 2.8rem)"}}>Three steps to the CodeClash Arena</h2>
                </div>
                <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2rem"}}>
                    {steps.map((step) => {
                        const Icon = stepIcons[step.icon];
                        return (
                            <div key = {step.step} style={{background: "var(--background-card)", borderRadius: 20, padding: "2rem"}}>
                                <div className="flex items-center gap-4 mb-4">
                                    <Icon size = {34} className="text-primary"/>
                                    <span className="text-secondary-muted text-[0.7rem] font-bold">{step.step}</span>
                                </div>
                                    <h3 style={{color: "var(--primary-text)", fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.75rem"}}>{step.title}</h3>
                                    <p style={{color: "var(--primary-text)", lineHeight: 1.7}}>{step.desc}</p>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/*Features of the game */}
            <section id="features" style = {{padding: "3rem 8%", background: "var(--background)"}}>
                <div style={{textAlign: "center", marginBottom: "4rem"}}>
                    <p style={{ color: "var(--primary-text)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.15rem", textTransform: "uppercase", marginBottom: "0.75rem"}}>Features</p>
                    <h2 style={{fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, color: "var(--primary-text)", margin: 0}}>Built for competitors</h2>
                </div>
                <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "1.5rem"}}>
                    {features.map((feature) => {
                        const Icon = featureIcons[feature.icon];
                        return (
                            <div key = {feature.title} style={{background: "var(--background-card)", border: "1px solid rgba(252, 235, 221, 0.07)", borderRadius: "18px", padding: "1.75rem", transition: "0.25"}}>
                                <Icon size = {34} className="text-primary" style={{marginBottom: "1rem"}}/>
                                <h3 style={{color: "var(--primary-text)", fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.75rem"}}>{feature.title}</h3>
                                <p style={{color: "var(--primary-text)", lineHeight: 1.7, margin: 0}}>{feature.desc}</p>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/*Who the game is for - audience */}
            <section id="audience" style = {{padding: "3rem 8%", background: "var(--background)"}}>
                <div style={{textAlign: "center", marginBottom: "4rem"}}>
                    <p style={{color: "var(--primary-text)", letterSpacing: "0.15rem", textTransform: "uppercase", fontSize: "0.75rem"}}>Who It's For</p>
                    <h2 style={{fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, color: "var(--primary-text)", margin: 0}}>For students who want to win</h2>
                    <p style={{color: "var(--muted)", lineHeight: 1.8, marginBottom: "2rem", margin: "1rem 1.5rem"}}>CodeClash is build for beginners and early career developers where math and programming practice sessions become a competitive match against another player.</p>
                    <div style={{display: "flex", flexDirection: "column", alignItems: 'center'}}>
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                        {audience.map((item) => (
                            <div key = {item} style={{display: "flex", alignItems: "flex-start"}}>
                                <CircleCheck size = {18} className="text-primary" strokeWidth={2.5} style={{marginTop: "2px", flexShrink: 0 ,margin: "1rem 1.5rem"}}/>
                                <span style={{color: "var(--primary-text)", lineHeight: 1.5, margin: "0.6rem", gap: "1px"}}>{item}</span>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
            </section>

            {/*for docs*/}
            <section id="documentation" style={{padding: "3rem 8%", background: "var(--background)"}}>
                <div style={{ textAlign: "center", marginBottom: "4rem",}}>
                    <p style={{color: "var(--primary-text)", fontSize: "0.75rem", letterSpacing: "0.15rem", textTransform: "uppercase", fontWeight: 700}}>Documentation</p>
                    <h2 style={{color: "var(--primary-text)", fontSize: "clamp(2rem,4vw, 2.8rem", fontWeight: 900, margin: "1rem 0"}}>Learn more about CodeClash</h2>
                </div>
                <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr)", gap: "1.5rem"}}>
                    {docs.map((doc) => {
                        const Icon = docIcons[doc.icon];
                        return (
                            <Link key = {doc.title} to={doc.link} style={{textDecoration: "none"}}>
                                <div style={{background: "var(--background-card)", border: "1px solid var(--border)", borderRadius: "18px"
                                    , padding: "2rem", height: "100%", transition: "all 0.2 ease"}}>
                                        <Icon size = {34} className="text-primary"/>
                                        <h3 style={{color: "var(--primary-text)", marginTop: "1rem", marginBottom: "0.75rem", fontWeight: 700}}>{doc.title}</h3>
                                        <p style={{ color: "var(--primary-text)", lineHeight: 1.7, margin: 0}}>{doc.desc}</p>
                                    </div>
                            </Link>
                        )
                    })}
                </div>
            </section>

            {/*CLosing footer */}
            <footer style={{background: "var(--background)", borderTop: "1px solid rgba(252, 235, 221, 0.08)", padding: "2rem 8%"}}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem"}}>
                    <div>
                        <span style={{fontSize: "1.3rem", fontWeight: 900, color: "var(--primary)", letterSpacing: '0.05rem'}}>CODECLASH
                        </span>
                        < p style={{color: "var(--primary-text)", marginTop: "0.5rem", fontSize: "0.9rem"}}>Competitive Programming & Mathematic Battles</p>
                    </div>
                    <p style={{color: "var(--primary)", fontSize: "1.3rem ", fontWeight: 900,margin: 0, textAlign: "right"}}>QUANTDEVS</p>
                </div>
            </footer>
        </div>
    )
}
export default Landing;