// This is the component section for the brand style guide - it will show every variant and state of the components used by the app

import React from "react";
import SharedLayout from "./SharedLayout";
import type { BrandStyleGuideContent } from "../../Models/BrandStyleGuideModel";

interface Props {
    content: BrandStyleGuideContent;
}

const ComponentSection: React.FC<Props> = ({content}) => {
    return (
        <SharedLayout
            id = "components" eyebrow="05 - Component Library" title = "Components" description= "All interactive components used in the system. Each shows variants and states.">

            
        </SharedLayout>
    );
};

export default ComponentSection;