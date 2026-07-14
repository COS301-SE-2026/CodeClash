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
                {[
                    {
                        fg: '#FCECDD',
                        bg: '#530A24',
                        fgLabel: 'Primary Text',
                        bgLabel: 'Primary',
                        ratio: '12.4:1',
                        level: 'AAA',
                    },
                    {
                        fg: '#FFEFE0',
                        bg: '#520A24',
                        fgLabel: 'Secondary',
                        bgLabel: 'Primary',
                        ratio: '10.2:1',
                        level: 'AAA',
                    },
                    {
                        fg: '#FFFFFF',
                        bg: '#C0395A',
                        fgLabel: 'White',
                        bgLabel: 'Button Primary',
                        ratio: '4.6:1',
                        level: 'AA',
                    },
                    {
                        fg: '#530A24',
                        bg: '#FFEFE0',
                        fgLabel: 'Secondary Text',
                        bgLabel: 'Secondary',
                        ratio: '10.2:1',
                        level: 'AAA',
                    },
                    {
                        fg: '#9D2644',
                        bg: '#FFEFE0',
                        fgLabel: 'Button Text Secondary',
                        bgLabel: 'Secondary',
                        ratio: '4.8:1',
                        level: 'AA',
                    },
                    {
                        fg: '#FFFFFF',
                        bg: '#4CAF50',
                        fgLabel: 'White',
                        bgLabel: 'Success',
                        ratio: '4.5:1',
                        level: 'AA',
                    },
                    {
                        fg: '#FFFFFF',
                        bg: '#E53935',
                        fgLabel: 'White',
                        bgLabel: 'Danger',
                        ratio: '4.5:1',
                        level: 'AA',
                    },
                ].map((pair, i, arr) => (
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
                        <p className="text-gray-600 text-xs leading relaxed">- {rule}</p>
                    </div>
                ))}
            </div>
        </SharedLayout>
    );
};

export default AccessibilitySection;