import { useState } from "react";

import {help, faqs, contact} from "../Models/HelpMenuModel";

export interface HelpMenuViewModelProps {
    help: typeof help;
    faqs: typeof faqs;
    contact: typeof contact;

    openFAQ: number | null;
    toggleFAQ: (index:number) =>void;
}

export const HelpMenuViewModelFunction = (): HelpMenuViewModelProps => {
    const [openFAQ, setOpenFAQ] = useState<number | null>(0);
    const toggleFAQ = (index: number) => {
        setOpenFAQ((current) => current === index ? null : index);
    };

    return {
        help,
        faqs,
        contact,
        openFAQ,
        toggleFAQ,
    }
}