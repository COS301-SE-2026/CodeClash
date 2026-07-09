// This is the ViewModel for the brand style guide - this file will hold pieces of state and act as a hook between Model and View

import {useState, useCallback, useEffect} from "react";
import {brandStyleGuideContent} from "../Models/BrandStyleGuideModel";
import type { BrandStyleGuideContent } from "../Models/BrandStyleGuideModel";

export const navSections = [
    {
        id: 'intro', label: 'Introduction',
    },
    {
        id: 'colors', label: 'Color Palette',
    },
    {
        id: 'typography', label: 'Typography',
    },
    {
        id: 'logo', label: 'Logo & Icons',
    },
    {
        id: 'tokens', label: 'Design Tokens',
    },
    {
        id: 'components', label: 'Components',
    },
    {
        id: 'layout', label: 'Layout & Spacings',
    },
    {
        id: 'accessibility', label: 'Accessibility',
    },
    {
        id: 'changelog', label: 'CHangelog',
    },
] as const;

export type SectionId = typeof navSections[number]['id'];