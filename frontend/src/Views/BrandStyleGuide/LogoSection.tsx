// The is the logo section for the brand style guide - this previews the logo and icons and prevents misuse through explicit rules

import React from "react";
import SharedLayout from "./SharedLayout";
import type { BrandStyleGuideContent } from "../../Models/BrandStyleGuideModel";

interface Props {
    content: BrandStyleGuideContent;
}

const LogoSection: React.FC<Props> = ({content}) => {
    return (
        <SharedLayout 
            id = "logo" eyebrow = "03 - Logo and Iconography" title="Logo System" description="The CodeClash wordmark, icon systems, and asset guidelines. UI icons use Lucide React and thematic assets use custom PNGs.">

            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Logo Variants</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {[
                    {
                        label: 'Primary - Dark',
                        bg: '#530a23',
                        text: '#FCECDD',
                        description: 'Main (default) usage',
                    },
                    {
                        label: 'Primary - Light', //Should i say 'Secondary - Dark' instead?
                        bg: '#FFEFE0',
                        text: '#530a23',
                        description: 'Light surfaces',
                    },
                ].map(v => (
                    <div key ={v.label} className="rounded-xl p-5 flex flex-col items-center justify-center border border-gray-100"
                    style = {{background: v.bg}}>
                        <p className="font-black text-lg mb-2 text-center"
                        style = {{fontFamily: 'Roboto, sans-serif', color: v.text}}>CodeClash
                        </p>
                        <p className="text-xs text-center"
                        style = {{color: v.text, opacity: 0.5}}>{v.label}
                        </p>
                        <p className="text-xs text-center mt-0.5"
                        style = {{color: v.text, opacity: 0.35}}>{v.description}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grif grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="border border-gray-100 rounded-xl p-5">
                    <p className="text-sm font-semibold text-green-600 uppercase tracking-widest mb-3">Permitted</p>
                    {content.logoRules.permitted.map(rule => (
                        <p key = {rule} className="text-sm text-gray-600 mb-0 leading-relaxed">- {rule}</p>
                    ))}
                </div>
                <div className="border border-gray-100 rounded-xl p-5">
                    <p className="text-sm font-semibold text-red-600 uppercase tracking-widest mb-3">Forbidden</p>
                    {content.logoRules.forbidden.map(rule => (
                        <p key = {rule} className="text-sm text-gray-600 mb-0 leading-relaxed">- {rule}</p>
                    ))}
                </div>
            </div>

            {/*For UI, the Lucide React */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">UI Icons - Lucide React</p>
            <div className="border border-gray-100 rounded-xl p-5 mb-4">
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    All UI icons use{' '}
                    <strong className="text-gray-900">Lucide React</strong> - outline style, consistent 2px stroke weight.
                    Install via{' '}
                    <code className="text-[#530a23] bg-gray-50 px-1.5 py-0.5 rounded text-xs">npm install lucide-react</code>
                </p>

                <div className="flex gap-3 flex-wrap mb-5">
                    {[
                        {
                            size: '16px/w-4 h-4',
                            use: 'Inline/labels',
                        },
                        {
                            size: '20px/w-5 h-5',
                            use: 'Buttons/nav',
                        },
                        {
                            size: '24px/w-6 h-6',
                            use: 'Standalone/decorative',
                        }
                    ].map (item => (
                        <div key = {item.size} className="border border-gray-100 rounded-lg px-4 py-2">
                            <p className="text-xs font-semibold text-[#530a23]">{item.size}</p>
                            <p className="text-xs font-gray-400">{item.use}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-gray-50 rounded-xl p-5 flex flex-wrap gap-6 items-center mb-5">
                    {[
                        {
                            label: 'Search',
                            svg: '',
                        },
                        {
                            label: 'User',
                            svg: '',
                        },
                        {
                            label: 'Trophy',
                            svg: '',
                        },
                        {
                            label: 'Settings',
                            svg: '',
                        },
                    ].map(icon => (
                        <div key = {icon.label} className="flex flex-col items-center gap-1.5">
                            <svg>
                                //Still need to find and switch to svg so will come back here
                            </svg>
                            <span className="text-xs text-gray-400">{icon.label}</span> 
                        </div>
                    ))}
                </div>
                
                {/*Rules for the Lucide React*/}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                        'Always use outline style - never filled',
                        'Color via Tailwind text',
                        'Stroke weight: 2px default',
                        'If using filled, never mix filled and outline in the same context',
                        'Import individually: import { Search } from "lucide-react";'
                    ].map(rule => (
                        <p key = {rule} className="text-xs text-gray-500 leading-relaxed">- {rule}</p>
                    ))}
                </div>
            </div>
        </SharedLayout>
    );
};

export default LogoSection;