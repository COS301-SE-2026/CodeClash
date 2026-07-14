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
            id = "changelog" eyebrow="08 - Changelog" title = "Demo 1 to Demo 2" description = "What changed between Demo 1 and Demo 2 with rationale for each decision. This proves the guide has evolved based on real implementation decisions.">
            
            <div>
                
            </div>
        </SharedLayout>
    );
};

export default ChangelogSection;