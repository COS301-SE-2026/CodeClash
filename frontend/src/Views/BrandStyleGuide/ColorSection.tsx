// This is the color secto=ion of the brand style guide - it will render the color swatches including the themes (later)

import React from "react";
import SharedLayout from "./SharedLayout";
import type { BrandStyleGuideContent } from "../../Models/BrandStyleGuideModel";

interface Props {
    content: BrandStyleGuideContent;
    clipboardCopy: (text: string, key: string) => void;
    copied: string | null;
}

const ColorSection: React.FC<Props> = ({content, clipboardCopy, copied}) => {
    return (
        <SharedLayout
            id = "colors" eyebrow="01 - Color Palette" title="Color System" description="All colors drawn from CodeClash: Robots in Space - maroon, pink and cream. Click a swatch to copy the hex value!">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                {content.colors.map(color => (
                    <div key={color.name} onClick={() => clipboardCopy(color.hex, color.name)}
                    className="flex gap-4 items-start border border-gray-100 rounded-xl p-4 cursor pointer hover:border-gray-300 transition colors duration-150">
                        <div className="w-12 h-12 rounded-lg flex-shrink-0 border border-gray-100"
                            style={{background: color.hex}}
                        />

                        <div className="flex-1 min-w-0">
                            <div className="felx items-center justify-between gap-2 mb-1">
                                <p className="text-sm font-semibold text-gray-900">{color.name}</p>
                                <code className="text-xs text-gray-400 font-mono">
                                    {copied === color.name ? 'Copied!': color.hex}
                                </code>
                            </div>
                            <p className="text-xs text-gray-400 font-mono mb-1">RGB {color.rgb}, HSL {color.hsl}</p>
                            <p className="text-xs text-gray-500 mb-1">{color.usage}</p>
                            <p className="text-xs text-[#530A24] font-medium">WCAG {color.wcag}</p>
                        </div>
                    </div>
                ))}
            </div>
        </SharedLayout>
    );
};

export default ColorSection;