//This is the changelog section for the brand style guide - what changed from Demo 1

import React from "react";
import SharedLayout from "./SharedLayout";
import type { BrandStyleGuideContent } from "../../Models/BrandStyleGuideModel";

interface Props {
    content: BrandStyleGuideContent;
}

const ColorsCategory: Record<string, string> = {
    'Colors': 'bg-pink-100 text-pink-700',
    'Typography': 'bg-purple-100 text-purple-700',
    'Styling Architecture': 'bg-orange-100 text-orange-700',
    'Architecture': 'bg-blue-100 text-blue-700',
    'Pages and Visual Design': 'bg-green-100 text-green-700',
};

const ChangelogSection: React.FC<Props> = ({content}) => {
    return (
        <SharedLayout
            id = "changelog" eyebrow="08 - Changelog" title = "Demo 1 → Demo 2" description = "What changed between Demo 1 and Demo 2 with rationale for each decision. This proves the guide has evolved based on real implementation decisions.">
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-8">
                {content.changelog.map(entry => (
                    <div key = {entry.category} className= {`text-center px-3 py-2 rounded-lg text-xs font-semibold ${ColorsCategory[entry.category] ?? 'bg-gray-100 text-gray-600'}`}>
                        {entry.category}
                    </div>
                ))}
            </div>

            <div className="relative pl-6">
                <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-200"/>
                {content.changelog.map((entry) => (
                    <div key = {entry.category} className="relative mb-6">
                        <div className= {`absolute -left-4 top-4 w-3 h-3 rounded-full border-2 border-white ${ColorsCategory[entry.category] ?.split(' ')[0] ?? 'bg-gray-300'}`}/>
                        <div className="border border-gray-100 rounded-xl overflow-hidden">
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                                <span className = {`text-xs font-semibold px-3 py-1 rounded-full ${ColorsCategory[entry.category] ?? 'bg-gray-100 text-gray-600'}`}>{entry.category}</span>
                                <span className="text-xs text-gray-400">{entry.changes.length} changes</span>
                            </div>

                            <div className="px-5 py-4">
                                {entry.changes.map( change=> (
                                    <div key = {change} className="flex gap-2 mb-2">
                                        <span className="text-[#530A23] text-sm mt-0.5 flex-shrink-0">-</span>
                                        <p className="text-sm text-gray-600 leading-relaxed">{change}</p>
                                    </div>
                                ))}

                                <div className="mt-4 pt-4 border-t border-gray-50">
                                    <p className="text-xs text-gray-400 leading-relaxed">
                                        <span className="font-semibold text-gray-500">Rationale: </span>
                                        {entry.rationale}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </SharedLayout>
    );
};

export default ChangelogSection;