// This is the View for the brand style guide - this will contain all react components, no logic, and call the ViewModel

import React from "react";
import { BrandStyleGuideViewModelFunction, navSections } from "../ViewModels/BrandStyleGuideViewModel";
import IntroSection from "./BrandStyleGuide/IntroductionSection";

const BrandStyleGuide: React.FC = () => {
    const {
        content, active, copied, sectionScroll, clipboardCopy,
    } = BrandStyleGuideViewModelFunction();

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
                <div className="max-w-[1200px] mx-auto px-5 h-15 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-[#530a23] flex items-center justify center">
                            <span className="text-[#FCECDD] font-black text-xs">CodeClash</span>
                        </div>
                        <span className="font-bold text-sm text-gray-900">Brand Style Guide</span>
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">v{content.meta.version}</span>
                    </div>
                </div>    
            </nav>
        </div>
    )
}

export default BrandStyleGuide;