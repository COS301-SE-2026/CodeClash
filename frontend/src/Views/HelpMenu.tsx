import React from "react";
import { Link } from "react-router";
import { BookOpen, HelpCircle, GraduationCap, Info, } from "lucide-react";
import { HelpMenuViewModelFunction } from "../ViewModels/HelpMenuViewModel";

const HelpMenu: React.FC = () => {
    const {
        help, faqs, contact, openFAQ, toggleFAQ,
    } = HelpMenuViewModelFunction();

    const helpIcons = {
        book: BookOpen,
        help: HelpCircle,
        graduation: GraduationCap,
        info: Info,
    };

    return (
        <div className="min-h-screen" style={{background: "#0a0008", color: "#fcecdd", fontFamily: "Roboto, sans-serif"}}>
            <section style={{padding: "3rem 8% 5rem", textAlign: "center"}}>
                <HelpCircle size = {60} color="#c0395a" style={{marginBottom: "1rem"}}/>
                <h1 style={{fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, marginBottom: "1rem"}}>Help Menu</h1>
                <p style={{color: "rgba(252, 235, 221, 0.65)", maxWidth: "700px", margin: "0 auto", lineHeight: 1.8}}>Everything you need to get started with CodeClash. Browse our game guide, frequently asked questions, tutorials amd support resources.</p>
            </section>

            <section style={{padding: "0 8% 6rem"}}>
                <div style={{display: "grid",gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "1.5rem"}}>
                    {help.map((h) => {
                        const Icon = helpIcons[h.icon];
                        if (h.link) {
                            return (
                                <Link key = {h.title} to={h.link} style={{textDecoration: "none"}}>
                        <div style={{background: "rgba(252, 236, 221, 0.03)", border: "1px solid rgba(252, 236, 221, 0.08)", borderRadius: "18px", padding: "2rem", height: "100%", transition: "0.2s"}}>
                            <Icon size={36} color="#c0395a"/>
                            <h3 style={{marginTop: "1rem", marginBottom: "0.75rem", color: "#fcecdd"}}>{h.title}</h3>
                            <p style={{color: "rgba(252, 236, 221, 0.6)", lineHeight: 1.7 , marginBottom: "1rem"}}>{h.desc}</p>
                        </div>
                        </Link>
                        );
                    }

                    {/*Copied from above */}
                    return (
                        <div key = {h.title} style={{background: "rgba(252, 236, 221, 0.03)", border: "1px solid rgba(252, 236, 221, 0.08)", borderRadius: "18px", padding: "2rem", height: "100%", transition: "0.2s"}}>
                            <Icon size={36} color="#c0395a"/>
                            <h3 style={{marginTop: "1rem", marginBottom: "0.75rem", color: "#fcecdd"}}>{h.title}</h3>
                            <p style={{color: "rgba(252, 236, 221, 0.6)", lineHeight: 1.7 , marginBottom: "1rem"}}>{h.desc}</p>
                        </div>
                    );
                    })}
                </div>
            </section>
        </div>
    );
};

export default HelpMenu;