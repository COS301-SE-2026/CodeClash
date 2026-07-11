// This is the typography section for the brand style guide - it will show the live text samples

import React from "react";
import SharedLayout from "./SharedLayout";
import type { BrandStyleGuideContent } from "../../Models/BrandStyleGuideModel";

interface Props {
    content: BrandStyleGuideContent;
}

const TypographySection: React.FC<Props> = ({content}) => {
    return (
        <SharedLayout 
            id = "typography" eyebrow = "02 - Typography" title="Type System" description="The sole typeface is Roboto - chosed for its readability, weight range, and geometric clarity. The font is sourced from Google Fonts under the SIL Open Font License (OFL) v1.1 and the Apache License 2.0, completely free to use for both personal and commercial purposes.">

        </SharedLayout>
    )
}

export default TypographySection;