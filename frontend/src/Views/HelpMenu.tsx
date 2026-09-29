import { BookOpen, HelpCircle, GraduationCap, Info, ChevronDown, ChevronRight, Mail} from "lucide-react";
import React from "react";
import { Link } from "react-router";

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
        <div className="min-h-screen" style={{background: 'var(--background)', color: 'var(--text)'}}>
            <section style={{padding: "3rem 8% 5rem", textAlign: "center"}}>
                <h1 className="text-xl font-black text-primary-text mb-3">Help Menu</h1>
                <p className="text-muted text-xsm leading-relaxed">Everything you need to get started with CodeClash. Browse our game guide, frequently asked questions, tutorials and support resources.</p>
            </section>

            <section style={{padding: "0 8% 6rem"}}>
                <div style={{display: "grid",gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "1.5rem"}}>
                    {help.map((h) => {
                        const Icon = helpIcons[h.icon];
                        if (h.link) {
                            return (
                                <Link key = {h.title} to={h.link} style={{textDecoration: "none"}}>
                                    <div className = "card-glass p-8 h-full">
                                        <Icon size={36} className = "text-primary"/>
                                        <h3 style={{marginTop: "1rem", marginBottom: "0.75rem", color: 'var(--text)'}}>{h.title}</h3>
                                        <p style={{color: 'var(--text)', lineHeight: 1.7 , marginBottom: "1rem"}}>{h.desc}</p>
                                    </div>
                                </Link>
                            );
                        }

                        {/*Copied from above */}
                        return (
                            <div key = {h.title} className = "card-glass p-8 h-full">
                                <Icon size={36} className = "text-primary"/>
                                <h3 style={{marginTop: "1rem", marginBottom: "0.75rem", color: 'var(--text)'}}>{h.title}</h3>
                                <p style={{color: 'var(--text)', lineHeight: 1.7 , marginBottom: "1rem"}}>{h.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/*About section */}
            <section style={{padding: "0 8% 6rem"}}>
                <div className="card-glass max-w-[1000px] mx-auto p-12">
                    <div style={{display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem"}}>
                        <Info size={32} className = "text-primary"/>
                        <h2 style={{fontSize: "2rem", fontWeight: 900, margin: 0}}>About CodeClash</h2>
                    </div>
                    <p style={{color: 'var(--text)', lineHeight: 1.9, marginBottom: "1.5rem"}}>
                        {/*Copied from Figma wireframe! */}
                        CodeClash is an interactive competition platform that makes programming and mathematics fun, and engaging. Players challenge one another in real-time, earning points for speed and accuracy while climbing the leaderboard. With a space-inspired theme, customizable avatars, achievements, and live match results, CodeClash creates an exciting environment where users can sharpen their skills, track their progress, and compete against others in fast-paced battles.
                    </p>
                    <div style={{display: "grid", gridTemplateColumns: "repeat(autp-fit, minmax(220px, 1fr)", gap: "1.5rem"}}>
                        <div>
                            <h3 className = "text-primary" style={{ marginBottom: "0.5rem"}}>Mission</h3>
                            <p style={{color: 'var(--text)', lineHeight: 1.7}}>Make learning programming and mathematics fun, and engaging through friendly competition and meaningful progression.</p>
                        </div>
                        {/*copied above */}
                        <div>
                            <h3 className = "text-primary" style={{ marginBottom: "0.5rem"}}>Vision</h3>
                            <p style={{color: 'var(--text)', lineHeight: 1.7}}>Create a community of continuous improvement through challenges and a celebration of achievemnets.</p>
                        </div>
                        {/*copied above */}
                        <div>
                            <h3 className = "text-primary" style={{ marginBottom: "0.5rem"}}>Core Values</h3>
                            <p style={{color: 'var(--text)', lineHeight: 1.7}}>Fair competition, continuous learning, accessibility, teamwork, growth mindset, and innovation.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/*faq */}
            <section style= {{padding: "0 8% 6rem"}}>
                <h2 style={{textAlign: "center", fontSize: "2.2rem", fontWeight: 900, marginBottom: "3rem"}}>Frequently Asked Questions</h2>
                <div className="max-w-[900px] mx-auto">
                    {faqs.map((faq, index) => (
                        <div key={faq.question} style={{borderBottom: "1px solid rgba(252, 236, 221, 0.08)"}}>
                            <button onClick={( ) => toggleFAQ(index)} style={{width: "100%", background: "transparent", border: "none", color: 'var(--text)'
                                ,display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", padding: "1.4rem 0", fontSize: "1rem", fontWeight: 700}}>{faq.question}
                                {openFAQ === index ? (
                                    <ChevronDown/>
                                ) : (<ChevronRight/>)}
                            </button>

                            {openFAQ === index && (
                                <p style={{color: 'var(--text)', lineHeight: 1.8, paddingBottom: "1.5rem"}}>{faq.answer}</p>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/**contact support */}
            <section className="card-glass max-w-[900px] mx-auto p-12 text-center mb-16">
                <Mail size={44} className = "text-primary" style={{marginBottom: "1rem"}}/>
                <h2 style={{color: 'var(--text)',fontSize: "2rem", fontWeight: 900, marginBottom: "1rem"}}>{contact.heading}</h2>
                <p style={{color: 'var(--text)', lineHeight: 1.8, maxWidth: "650px", margin: "0 auto 2rem"}}>{contact.desc}</p>

                <a href="{`mailto:${contact.email}`}" className="btn btn-primary inline-flex">
                    <Mail size={18}/>
                    {contact.email}
                </a>
            </section>
        </div>
    );
};

export default HelpMenu;