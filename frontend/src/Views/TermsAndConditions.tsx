import { Dot, ArrowLeft } from "lucide-react";
import React from "react";
import { Link } from "react-router";

import { TermsAndConditionsViewModelFunction } from "../ViewModels/TermsAndConditionsViewModel";

const TermsAndConditions: React.FC = () => {
    const {section} = TermsAndConditionsViewModelFunction();

    return (
        <div className="relative min-h-screen bg-background" style={{padding: " 5rem 1rem 3rem"}}>
            {/*Back Button*/}
            <Link to='/sign-up' className="btn btn-ghost primary-back-button flex items-center gap-2 z-20">
                <ArrowLeft size={18}/>
                Back
            </Link>

            <div className="max-w-[950px] mx-auto">
                <div className="card-elevated p-10 md:p-16">
                    <div className="text-center mb-16">
                        <span className="eyebrow mb-3 inline-block">CodeClash</span>
                        <h1 className="text-3xl md:text-4xl font-black text-primary-text">Terms &amp; Conditions</h1>
                    </div>

                    {section.map((s) => (
                        <section key={s.title} className="mb-11 last:mb-0">
                            <h2 className="text-md font-bold text-primary-text mb-4 pb-3 border-b border-border">{s.title}</h2>
                            {s.desc && (
                                <p className={`text-muted leading-relaxed ${s.bullets? 'mb-4': ''}`}>{s.desc}</p>
                            )}
                            {s.bullets && (
                                <ul className="list-none p-0 m-0">
                                    {s.bullets.map((bullet) => (
                                        <li key={bullet} className="mb-3 flex items-start gap-3">
                                            <Dot size={30} className="shrink-0 text-primary -mt-0.5"/>
                                            <span className="text-muted leading-relaxed">{bullet}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;