// This is the introduction section of the brand style guide, so that it doesn't just jump into the guide but instead gives the user a bit of information

import React from "react";
import SharedLayout from './SharedLayout';
import type { BrandStyleGuideContent } from "../../Models/BrandStyleGuideModel";

interface Props {
    content: BrandStyleGuideContent;
}

const IntroSection: React.FC<Props> = ({content}) => {
    return (
        <section id="intro" className="mb-20 scroll-mt-20 pt-8">
            <div className="mb-12">
                <p className="text- font-semibold text-[#530A24] uppercase tracking-widest mb-3">
                    {content.meta.project} - {content.meta.team} {/*will display CODECLASH - QUANTDEVS in the maroon (can change)*/}
                </p>
                <h1 className="text-3xl font-black text-gray-900 leading-tight mb-4">
                    Brand Style Guide
                </h1>
                <p className="text-gray-500 text-sm max-w-none leading-tight mb-6">
                    This serves as a definitive visual language guide, defining every design decision, for CodeClash - a competitive coding and mathematics gaming platform.
                </p>
                <div className="flex flex-wrap gap-2">
                    {['v' + content.meta.version, content.meta.date, 'WCAG 2.2 AA', 'Tailwind v4', 'MVVM Architecture'].map(tag => ( //an array of els that map will loop over, this was easier than writing sep <span> els
                        <span key={tag} className="text-xs font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
            <div className="pt-8 border-t border-gray-100"/>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/*some branding*/}
                {[
                    {
                        label: 'Mission/Goal',
                        body: 'To make learning programming and mathematics engaging through real-time competitive challenges that inspire continuous skill development and problem-solving.',
                    },
                    {
                        label: 'Target Audience',
                        body: 'Students, aspiring programmers, and mathematic enthusiasts who want to improve their coding and problem-solving skills through engaging, competitive learning.',
                    },
                    {
                        label: 'Personality',
                        body: 'By default: bold, and cosmic where the UI feels stepping into a mission control centre.'
                    },
                    {
                        label: 'Aesthetic',
                        body: 'Deep maroon backgrounds, pink to crimson and maroon gradients, clean typography.',
                    }
                ].map(pillar => (
                    <div key={pillar.label} className="rounded-xl p-5 transition-colors duration-150 tracking-widest">
                        <p className="text-sm font-semibold text-[#530A24] uppercase mb-2">{pillar.label}</p>
                        <p className="text-xsm text-gray-600">{pillar.body}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default IntroSection;