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
            id = "logo" eyebrow = "03 - Logo and Iconography" title="Logo System" description="The CodeClash wordmark uses Roboto font in black. Clear space of atleast 1x the logo height must be maintained on all sides of wordmark.">
            
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
        </SharedLayout>
    );
};

export default LogoSection;