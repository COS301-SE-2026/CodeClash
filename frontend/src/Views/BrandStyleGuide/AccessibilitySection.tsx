//This is the accessibility section for the brand style guide 

import React from "react";
import SharedLayout from "./SharedLayout";
import type { BrandStyleGuideContent } from "../../Models/BrandStyleGuideModel";

interface Props {
    content: BrandStyleGuideContent;
}

const AccessibilitySection: React.FC<Props> = ({content}) => {
    return (
        <SharedLayout
            id = "accessibility" eyebrow = "07 - Accessibility" title="Accessibility" description="Conformance target is WCAG 2.2 minimum. AAA is achieved for all body text paitings on the primary dark background.">

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                {[
                    {
                        label: 'Conformance',
                        value: 'WCAG 2.2 AA',
                    },
                    {
                        label: 'Body Text Contrast',
                        value: '12.4:1',
                    },
                    {
                        label: 'Button Contrast',
                        value: '4.6:1',
                    },
                ].map(item => (
                    <div key = {item.label} className="border border-gray-100 rounded-xl p-4 text-center">
                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                        <p className="text-xs font-semibold text-gray-900">{item.value}</p>
                    </div>
                ))}
            </div>
        </SharedLayout>
    );
};

export default AccessibilitySection;