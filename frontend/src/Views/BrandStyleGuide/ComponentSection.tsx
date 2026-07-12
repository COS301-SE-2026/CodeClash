// This is the component section for the brand style guide - it will show every variant and state of the components used by the app

import React, {useState} from "react";
import SharedLayout from "./SharedLayout";
import type { BrandStyleGuideContent } from "../../Models/BrandStyleGuideModel";

interface Props {
    content: BrandStyleGuideContent;
}

const ComponentSection: React.FC<Props> = ({content}) => {
    const [active, setActive] = useState(0);
    return (
        <SharedLayout
            id = "components" eyebrow="05 - Component Library" title = "Components" description= "All interactive components used in the system. Each shows variants and states.">

            <div className="flex flex-wrap gap-2 mb-6">
                {content.components.map((c,i) => (
                    <button key = {c.name} onClick={() => setActive(i)} className= {`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-150 cursor-pointer ${active === i ? 'bg-[#530a23] text-[#FCECDD] border-[#530a23]' : 'bg-white text-gray-500 border-gray-200 hover:border-400'}`}>
                        {c.name}
                    </button>
                ))}
            </div>

            {content.components[active] && (() => {
                const c = content.components[active];
                return (
                    <div className="border border-gray-100 rounded-xl overflow-hidden">
                        <div className="bg-gray-50 p-8 flex items-center justify-center gap-4 flex-wrap border-b border-gray-100 min-h-[120px]">
                            <ComponentPreview name = {c.name} />
                        </div>
                    </div>
                );
            })()}
        </SharedLayout>
    );
};

const ComponentPreview: React.FC<{name:string}> = ({name}) => {
    if (name === 'Button Primary') return (
        <>
            <button className= "bg-[#C0395A] text-white rounded-[20px] px-8 py-3 font-bold text-sm cursor-pointer shadow-md hover:-translate-y-0.5 transition-trasnform">Sign up</button>
            <button className= "bg-[#C0395A] text-white rounded-[20px] px-8 py-3 font-bold text-sm cursor-pointer shadow-md -translate-y-0.5 opacity-90">Hover</button>
            <button disabled className= "bg-[#C0395A] text-white rounded-[20px] px-8 py-3 font-bold text-sm opacity-40 cursor-not-allowed">Disabled</button>
            <button className= "bg-[#C0395A] text-white rounded-[20px] px-8 py-3 font-bold text-sm opacity-75 cursor-wait">Loading..</button>
        </>
    );
};

export default ComponentSection;