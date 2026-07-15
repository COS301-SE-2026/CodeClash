// This is the voice section for the brand style guide - dos and donts for voice

import React from "react";
import SharedLayout from "./SharedLayout";
import type { BrandStyleGuideContent } from "../../Models/BrandStyleGuideModel";

interface Props {
    content: BrandStyleGuideContent;
}

const VoiceSection: React.FC<Props> = ({content}) => {
    return (
        <SharedLayout
            id = 'voice' eyebrow="08 - Voice & Tone" title="Writing Style" description="CodeClash is direct, and motivating. The platform speaks with confidence - never pleading, nor vague.">
            
            <div>

            </div>
        </SharedLayout>
    );
};

export default VoiceSection;