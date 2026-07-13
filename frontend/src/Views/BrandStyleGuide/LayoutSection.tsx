// This is the layout and spacings section for the brand style guide - to ensure that the UI will be consistent

import React from "react";
import SharedLayout from "./SharedLayout";
import type { BrandStyleGuideContent } from "../../Models/BrandStyleGuideModel";

interface Props {
    content: BrandStyleGuideContent;
}

const LayoutSection: React.FC<Props> = ({content}) => {
    return (
        <SharedLayout
            id = "layout" eyebrow="06 - Layout & Spacing" title = "Grid & Spacing" description="The system uses three distinct layout patterns - auth pages, the welcome page, and the dashboard. All share the same spacing scale and token system.">
            
            {/*Page Layouts */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Page Layout Patterns</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                {[
                    {
                        name: 'Auth Pages',
                        pages: 'SignIn, SignUp',
                        descrp: 'Single centered column, max width 560px, vertical flex with gap-4. Thematic assets (UFO and planet) either above or below the form. Full screen height with overflow-x-hidden.',
                        wireframe: '', //can i use an image here?
                    },
                ].map(layout => (
                    <div key ={layout.name} className="border border-gray-100 rounded-xl p-5">
                        <p className="text-sm font-bold text-gray-900 mb-1">{layout.name}</p>
                        <p className="text-xs text=[#530a23] mb-3">{layout.pages}</p>
                        <p className="text-xs text-gray-500 leading-relaxed mb-4">{layout.descrp}</p>
                        {/*Wireframe part here once decided */}
                    </div>
                ))}
            </div>
        </SharedLayout>
    );
};

export default LayoutSection;