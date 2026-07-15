// This is the voice section for the brand style guide - dos and donts for voice

import React from "react";
import SharedLayout from "./SharedLayout";
import type { BrandStyleGuideContent } from "../../Models/BrandStyleGuideModel";

interface Props {
    content: BrandStyleGuideContent;
}

const VoiceSection: React.FC<Props> = ({content}) => {
    return (
        <SharedLayout
            id = 'voice' eyebrow="08 - Voice & Tone" title="Writing Style" description="CodeClash is direct, and motivating. The platform speaks with confidence - never pleading, nor vague.">
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                {[
                    {
                        word: 'Direct',
                        meaning: 'No filler. Say it as it is.'
                    },
                    {
                        word: 'Motivating',
                        meaning: 'Challenges are opportunities to rise.'
                    },
                    {
                        word: 'Confident',
                        meaning: 'The platfrom knows what it is doing.'
                    }
                ].map(p=> (
                    <div key = {p.word} className="border border-gray-100 rounded-xl p-4">
                        <p className="text-xs font-bold text-[#52a023] mb-1">{p.word}</p>
                        <p className="text-xs text-gray-500 leading-relaxed">{p.meaning}</p>
                    </div>
                ))}
            </div>
        </SharedLayout>
    );
};

export default VoiceSection;