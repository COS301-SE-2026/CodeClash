// This is the View for the brand style guide - this will contain all react components, no logic, and call the ViewModel

import React from "react";
import { BrandStyleGuideViewModelFunction, navSections } from "../ViewModels/BrandStyleGuideViewModel";
import IntroSection from "./BrandStyleGuide/IntroductionSection";
import ColorSection from "./BrandStyleGuide/ColorSection";
import TypographySection from "./BrandStyleGuide/TypographySection";
import LogoSection from "./BrandStyleGuide/LogoSection";
import TokenSection from "./BrandStyleGuide/TokenSection";
import ComponentSection from "./BrandStyleGuide/ComponentSection";
import LayoutSection from "./BrandStyleGuide/LayoutSection";
import AccessibilitySection from "./BrandStyleGuide/AccessibilitySection";
import ChangelogSection from "./BrandStyleGuide/ChangelogSection";
import VoiceSection from "./BrandStyleGuide/VoiceSection";

const BrandStyleGuide: React.FC = () => {
    const {
        content, active, copied, sectionScroll, clipboardCopy,
    } = BrandStyleGuideViewModelFunction();

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
                <div className="w-full mx-auto px-5 h-15 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#530a23] flex items-center justify-center">
                            <span className="text-[#FCECDD] font-black text-xs">CC</span>
                        </div>
                        <span className="font-bold text-sm text-gray-900">Brand Style Guide</span>
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-sm">v{content.meta.version}</span>
                    </div>
                    <div className="hidden md:flex items-center gap-1">
                        {navSections.map(section => (
                            <button type="button" key={section.id} onClick={() => sectionScroll(section.id)}
                            className= {
                                `px-2 py-1.5 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer border-none ${active === section.id ? 'bg-[#530a23] text-[#FCECDD]' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100 bg-transparent'}`}
                            >
                                {section.label}
                            </button>
                        ))}
                    </div>
                </div>    
            </nav>

            <div className = "max-w-[860px] mx-auto px-6 pt-24 pb-24">
                <IntroSection content = {content}/>
                <ColorSection content = {content} clipboardCopy={clipboardCopy} copied={copied}/>
                <TypographySection content = {content}/>
                <LogoSection content={content}/>
                <TokenSection content = {content} clipboardCopy={clipboardCopy} copied = {copied} />
                <ComponentSection content={content}/>
                <LayoutSection content = {content}/>
                <AccessibilitySection content = {content} />
                <VoiceSection content = {content}/>
                <ChangelogSection content={content}/>

                <footer className="mt-24 pt-8 border-t border-gray-100 text.center">
                    <p className="text-[#530a23] text-sm">{content.meta.project} - Brand Style Guide - {content.meta.team}</p>
                </footer>
            </div>
        </div>
    );
};

export default BrandStyleGuide;