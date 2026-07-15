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
        id: 'voice', label: 'Voice & Tone',
    },
    {
        id: 'changelog', label: 'Changelog',
    },
] as const;

export type SectionId = typeof navSections[number]['id'];

interface BrandStyleGuideViewModel {
    content: BrandStyleGuideContent;
    active: SectionId;
    copied: string | null;
    sectionScroll: (id: SectionId) => void;
    clipboardCopy: (text: string, key: string) => void;
}

export function BrandStyleGuideViewModelFunction(): BrandStyleGuideViewModel {
    const [active, setActive] = useState<SectionId>('intro');
    const [copied, setCopied] = useState<string | null>(null);

    useEffect(() => {
        const handler = () => {
            const scrollY = window.scrollY + 100; //how far the user has scrolled
            const sections = navSections.map(n => ({ id: n.id, el: document.getElementById(n.id)})).filter(s => s.el !== null); //This maps every item in navSections, copies the id and looks for an HTML el with that id. Then, filter keeps only objects whose els exist.

            for(let i = sections.length - 1; i >= 0; i--) { //start at the bottom and work up. if we start at the top then the section was passed already and will be True (wrong)
                if(sections[i].el!.offsetTop <= scrollY) { //ofsetTop means how far the section is from the top of the page and this if statement tells us if we have scrolled here yet - it tells us where the user currently is
                    setActive(sections[i].id as SectionId); //depending on where the user is, setActive changes and automatically highlights
                    break;
                }
            }
        };
        window.addEventListener('scroll', handler, {passive: true}); //whenever the user scrolls, the handler function will run and the scroll event will only read information, not stop the scrolling
        return () => window.removeEventListener('scroll', handler); //remove the listener when the scrolling stops otherwise the listener will keep on activating, wasting memory
    }, []); //empty dependency array

    const sectionScroll = useCallback((id: SectionId) => {
        document.getElementById(id)?.scrollIntoView({behavior: 'smooth'}); //WHen a section is clicked in the nav bar, the browser will scroll until the el is visible (if it exists). 'smooth' makes sure the broswer doesnt jump
    }, []); //empty dependancy array

    const clipboardCopy = useCallback((text: string, key: string) => {
        navigator.clipboard.writeText(text); //copies text to the users clipboard and updates setCopied
        setCopied(key);
        setTimeout(() => setCopied(null), 1500); //auto reset the state after a delay
    }, []); //empty dependancy array

    return {
        content: brandStyleGuideContent,
        active,
        copied,
        sectionScroll,
        clipboardCopy,
    };
}