// This is the token section for the brand style guide - a reusable token table that will have a copy functionality - correct file

import React from "react";
import SharedLayout from "./SharedLayout";
import type { BrandStyleGuideContent, DesignToken } from "../../Models/BrandStyleGuideModel";

interface Props {
    content: BrandStyleGuideContent;
    clipboardCopy: (text:string, key: string) => void;
    copied: string | null;
}

interface TableProps {
    title: string;
    rows: DesignToken[];
    clipboardCopy: (text: string, key: string) => void;
    copied: string | null;
}

const TokenTable: React.FC<TableProps> = ({title, rows, clipboardCopy, copied}) => (
    <div className="border border-gray-100 rounded-cl overflow-hidden mb-4">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{title}</p>
        </div>
        <div className="grid grid-cols-3 px-4 py-2 border-b border-gray-100">
            {['Token', 'Value', 'Usage'].map(h => (
                <p key = {h} className="text-xs text-gray-400 uppercase tracking-widest font-medium">{h}</p>
            ))}
        </div>
        {rows.map(row => (
          <button type="button" key={row.token} onClick={() => clipboardCopy(`var(${row.token})`, row.token)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && clipboardCopy(`var(${row.token})`, row.token)}
            className="grid grid-cols-3 px-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors duration-100 last:border-b-0 text-left w-full" type="button">
                <code className="text-xs text-[#530A24]">{copied === row.token ? 'Copied!' : row.token}</code>
                <code className="text-xs text-gray-500 pr-2">{row.value}</code>
                <span className="text-xs text-gray-500">{row.description}</span>
            </button>
        ))}
    </div>
);

const TokenSection: React.FC<Props> = ({ content, clipboardCopy, copied}) => {
    return (
        <SharedLayout
            id = "tokens" eyebrow = "04 - Design Tokens" title = "Token System" description="All tokens are CSs custom properies defined in global.css. The @theme inline block maps them to Tailwind utilities. Click any row to copy the token reference.">

            <TokenTable title = "Color Tokens" rows = {content.tokens.color} clipboardCopy={clipboardCopy} copied = {copied} />
            <TokenTable title = "Radius Tokens" rows = {content.tokens.radius} clipboardCopy={clipboardCopy} copied = {copied} />
            <TokenTable title = "Typography Tokens" rows = {content.tokens.typography} clipboardCopy={clipboardCopy} copied = {copied} />
            <TokenTable title = "Shadow Tokens" rows = {content.tokens.shadow} clipboardCopy={clipboardCopy} copied = {copied} />
        </SharedLayout>
    );
};

export default TokenSection;
