// This is the typography section for the brand style guide - it will show the live text samples - correct file

import React from "react";

import type { BrandStyleGuideContent } from "../../Models/BrandStyleGuideModel";

import SharedLayout from "./SharedLayout";

interface Props {
    content: BrandStyleGuideContent;
}

const TypographySection: React.FC<Props> = ({content}) => {
    return (
        <SharedLayout 
            id = "typography" eyebrow = "02 - Typography" title="Type System" description="The sole typeface is Roboto - chosen for its readability, weight range, and geometric clarity. The font is sourced from Google Fonts under the SIL Open Font License (OFL) v1.1 and the Apache License 2.0, completely free to use for both personal and commercial purposes.">
            
            <div className= "border border-gray-100 rounded-xl overflow-hidden mb-8">
                {content.typography.map((t,i) => (
                    <div key = {t.name} className= {`p-6 ${i<content.typography.length-1 ? 'border-b border-gray-100' : ''}`}>
                        <div className="flex items-center gap-4 mb-3">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest w-32 flex-shrink-0">{t.name}</span>
                            <code className="text-xs text-gray-500">{t.size}/w{t.weight}</code>
                            <code className="text-xs text-[#530A24]">{t.cssVar}</code>
                        </div>
                        <p className="text-gray-900 leading-tight" 
                            style = {{fontFamily: 'Roboto, sans-serif', fontSize: `clamp(1rem, ${Number.parseFloat(t.size) * 0.5}vw, ${t.size})`, fontWeight: t.weight,}}>{t.sample}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">{t.usage}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                    {
                        label: 'Font Family',
                        value: "'Roboto', sans-serif",
                    },
                    {
                        label: 'Source',
                        value: 'Google Fonts',
                    },
                    {
                        label: 'Licence',
                        value: 'SIL Open Font License (OFL) v1.1 and the Apache License 2.0'
                    },
                    {
                        label: 'Weights',
                        value: '400, 500, 600, 700, 800',
                    },
                    {
                        label: 'Line Height',
                        value: '1.6 - 1.7',
                    },
                    {
                        label: 'Letter Spacing',
                        value: '0.01rem (headings)',
                    },
                ].map(item => (
                    <div key={item.label} className="border border-gray-100 rounded-lg p-4">
                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                        <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                    </div>
                ))}
            </div>
        </SharedLayout>
    );
};

export default TypographySection;