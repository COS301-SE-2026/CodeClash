//This is the accessibility section for the brand style guide -correct file

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
                {content.accessibility.metrics.map(item => (
                    <div key = {item.label} className="border border-gray-100 rounded-xl p-4 text-center">
                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                        <p className="text-xs font-semibold text-gray-900">{item.value}</p>
                    </div>
                ))}
            </div>

            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Constrast Pairs</p>
            <div className="border border-gray-100 rounded-xl overflow-hidden mb-8">
                <div className="grid grid-cols-4 px-4 py-3 bg-gray-50 border-b border-gray-100">
                    {[
                        'Foreground',
                        'Background',
                        'Ratio',
                        'Level',
                    ].map(h => (
                        <p key = {h} className="text-xs text-gray-400 uppercase tracking-widest font-medium">{h}</p>
                    ))}
                </div>
                {content.accessibility.contrastPairs.map((pair, i, arr) => (
                    <div key = {pair.fgLabel + pair.bgLabel} className= {`grid grid-cols-4 px-4 py-3 items-center ${i<arr.length -1 ? 'border-b border-gray-50' : ''}`}>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded border border-gray-200 flex-shrink-0" style = {{background: pair.fg}} />
                            <span className="text-xs text-gray-600">{pair.fgLabel}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded border border-gray-200 flex-shrink-0" style = {{background: pair.bg}} />
                            <span className="text-xs text-gray-600">{pair.bgLabel}</span>
                        </div>
                        <p className="text-xs text-gray-900 font-semibold">{pair.ratio}</p>
                        <span className= {`text-xs font-bold px-2 py-0.5 rounded-full w-fit ${pair.level === 'AAA' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{pair.level}</span>
                    </div>
                ))}
            </div>

            {/*Rules */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Accessibility Rules</p>
            <div className="border border-gray-100 rounded-xl overflow-hidden mb-8">
                {content.accessibilityRules.map((rule, i, arr) => (
                    <div key={rule} className= {`flex gap-3 px-4 py-3 ${i < arr.length- 1 ? 'border-b border-gray-50' : ''}`}>
                        <span className="text-gray-600 text-xs leading relaxed">- {rule}</span>
                    </div>
                ))}
            </div>

            {/*Sections */}
            {content.accessibility.sections.map((section) => (
                <div key={section.title} className="mb-8">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">{section.title}</p>
                    <div className="border border-gray-100 rounded-xl p-5">
                        <ul className="space-y-2">
                            {section.items.map((item) => (
                                <div key={item} className="text-xsm text-gray-600 leading-relaxed flex gap-2">
                                    <span className="text-gray-600 text-xs leading-relaxed">- {item}</span>
                                </div>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </SharedLayout>
    );
};

export default AccessibilitySection;