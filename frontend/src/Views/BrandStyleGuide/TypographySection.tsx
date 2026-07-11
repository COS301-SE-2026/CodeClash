// This is the typography section for the brand style guide - it will show the live text samples

import React from "react";
import SharedLayout from "./SharedLayout";
import type { BrandStyleGuideContent } from "../../Models/BrandStyleGuideModel";

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
                    </div>
                ))}
            </div>
        </SharedLayout>
    )
}

export default TypographySection;