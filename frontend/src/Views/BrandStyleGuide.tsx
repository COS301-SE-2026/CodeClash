// This is the View for the brand style guide - this will contain all react components, no logic, and call the ViewModel

import React from "react";
import { BrandStyleGuideViewModelFunction, navSections } from "../ViewModels/BrandStyleGuideViewModel";
import IntroSection from "./BrandStyleGuide/IntroductionSection";

const BrandStyleGuide: React.FC = () => {
    const {
        content, active, copied, sectionScroll, clipboardCopy,
    } = BrandStyleGuideViewModelFunction();
}