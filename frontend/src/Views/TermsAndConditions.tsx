import React from "react";
import { Link } from "react-router";
import { TermsAndConditionsViewModelFunction } from "../ViewModels/TermsAndConditionsViewModel";

const TermsAndConditions: React.FC = () => {
    const {section} = TermsAndConditionsViewModelFunction();

    return (
        <div className="min-h-screen" style={{ background: 'var(--background)', fontFamily: "Roboto, sans-serif", padding: "3rem 1rem"}}>
            <div style={{maxWidth: "950px", margin: "0 auto"}}>
                {/*Copied back button from sign up page */}
            <   Link className="absolute top-10 left-10 bg-primary rounded-lg px-4 py-2 heading-sub hover:opacity-80"
                to='/sign-up'>
                ← Back
                </Link>

                <div style={{background: "#fcecdd", borderRadius: "12px", padding: "4rem", boxShadow: "0 8px 30px rgba(0,0,0,0.08)"}}>
                    <div style={{textAlign: "center", marginBottom: "4rem"}}>
                        <h1 style={{fontSize: "2.6rem", fontWeight: 900, color: "#000000", marginBottom: "0.75rem"}}>Terms & Conditions</h1>
                    </div>

                    {section.map((s) => (
                        <section key={s.title} style={{ marginBottom: "2.8rem"}}>
                            <h2 style={{fontSize: "1.35rem", fontWeight: 700, color: "#000000", marginBottom: "1rem"}}>{s.title}</h2>
                            {s.desc && (
                                <p style={{color: "var(--primary)", lineHeight: 1.9, marginBottom: s.bullets? "1rem" : 0, fontWeight: 500 }}>{s.desc}</p>
                            )}
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;