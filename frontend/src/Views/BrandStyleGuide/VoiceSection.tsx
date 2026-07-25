// This is the voice section for the brand style guide - dos and donts for voice - correct file

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                    <div className="px-4 py-3 bg-green-50 border-b border-gray-100 text-center">
                        <p className="text-xs font-semibold text-green-600 uppercase tracking-widest">Do</p>
                    </div>
                    {content.voiceRules.do.map((rule, i, arr) => (
                        <div key = {rule} className= {`px-2 py-2 ${i<arr.length-1 ? 'border-b border-gray-50' : ''}`}>
                            <p className="text-xs text-gray-700 font-medium leading-relaxed text-center">"{rule.split('-')[0].trim()}"</p>
                            {rule.includes('-') && (
                                <p className="text-xs text-gray-400 mt-0.5 text-center">{rule.split('-')[1].trim()}</p>
                            )}
                        </div>
                    ))}
                </div>

                {/*copying above layout and replacing do with dont and green with red */}
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                    <div className="px-4 py-3 bg-red-50 border-b border-gray-100 text-center">
                        <p className="text-xs font-semibold text-red-600 uppercase tracking-widest">Dont</p>
                    </div>
                    {content.voiceRules.dont.map((rule, i, arr) => (
                        <div key = {rule} className= {`px-2 py-2 ${i<arr.length-1 ? 'border-b border-gray-50' : ''}`}>
                            <p className="text-xs text-gray-700 font-medium leading-relaxed text-center">"{rule.split('-')[0].trim()}"</p>
                            {rule.includes('-') && (
                                <p className="text-xs text-gray-400 mt-0.5 text-center">{rule.split('-')[1].trim()}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </SharedLayout>
    );
};

export default VoiceSection;