// This is the token section for the brand style guide - a reusable token table that will have a copy functionality

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

);

const TokenSection: React.FC<Props> = ({ content, clipboardCopy, copied}) => {
    return (

    );
};

export default TokenSection;