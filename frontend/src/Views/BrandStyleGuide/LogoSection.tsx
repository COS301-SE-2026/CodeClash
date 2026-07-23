// The is the logo section for the brand style guide - this previews the logo and icons and prevents misuse through explicit rules - correct file

import React from "react";
import SharedLayout from "./SharedLayout";
import type { BrandStyleGuideContent } from "../../Models/BrandStyleGuideModel";

interface Props {
    content: BrandStyleGuideContent;
}

const LogoSection: React.FC<Props> = ({content}) => {
    return (
        <SharedLayout 
            id = "logo" eyebrow = "03 - Logo and Iconography" title="Logo System" description="The CodeClash wordmark, icon systems, and asset guidelines. UI icons use Lucide React and thematic assets use custom PNGs.">

            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Logo Variants</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {[
                    {
                        label: 'Primary - Dark',
                        bg: '#530a23',
                        text: '#FCECDD',
                        description: 'Main (default) usage',
                    },
                    {
                        label: 'Primary - Light', //Should i say 'Secondary - Dark' instead?
                        bg: '#FFEFE0',
                        text: '#530a23',
                        description: 'Light surfaces',
                    },
                ].map(v => (
                    <div key ={v.label} className="rounded-xl p-5 flex flex-col items-center justify-center border border-gray-100"
                    style = {{background: v.bg}}>
                        <p className="font-black text-lg mb-2 text-center"
                        style = {{fontFamily: 'Roboto, sans-serif', color: v.text}}>CodeClash
                        </p>
                        <p className="text-xs text-center"
                        style = {{color: v.text, opacity: 0.5}}>{v.label}
                        </p>
                        <p className="text-xs text-center mt-0.5"
                        style = {{color: v.text, opacity: 0.35}}>{v.description}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grif grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="border border-gray-100 rounded-xl p-5">
                    <p className="text-sm font-semibold text-green-600 uppercase tracking-widest mb-3">Permitted</p>
                    {content.logoRules.permitted.map(rule => (
                        <p key = {rule} className="text-xs text-gray-600 mb-0 leading-relaxed">- {rule}</p>
                    ))}
                </div>
                <div className="border border-gray-100 rounded-xl p-5">
                    <p className="text-sm font-semibold text-red-600 uppercase tracking-widest mb-3">Forbidden</p>
                    {content.logoRules.forbidden.map(rule => (
                        <p key = {rule} className="text-xs text-gray-600 mb-0 leading-relaxed">- {rule}</p>
                    ))}
                </div>
            </div>

            {/*For UI, the Lucide React */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">UI Icons - Lucide React</p>
            <div className="border border-gray-100 rounded-xl p-5 mb-4">
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    All UI icons use{' '}
                    <strong className="text-gray-900">Lucide React</strong> - outline style, consistent 2px stroke weight.
                    Install via{' '}
                    <code className="text-[#530a23] bg-gray-50 px-1.5 py-0.5 rounded text-xs">npm install lucide-react</code>
                </p>

                <div className="flex gap-3 flex-wrap mb-5">
                    {[
                        {
                            size: '20px / w-5 h-5',
                            use: 'Header icons - Search, Bot, UserCircle',
                        },
                        {
                            size: '24px / w-6 h-6',
                            use: 'Standalone / decorative icons',
                        }
                    ].map (item => (
                        <div key = {item.size} className="border border-gray-100 rounded-lg px-4 py-2">
                            <p className="text-xs font-semibold text-[#530a23]">{item.size}</p>
                            <p className="text-xs font-gray-400">{item.use}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-gray-50 rounded-xl p-5 flex flex-wrap gap-8 items-center mb-5">
                    {[
                        {
                            label: 'Search',
                            svg: 'M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z',
                        },
                        {
                            label: 'UserCircle',
                            svg: 'M18.364 18.364A9 9 0 0 0 12 3a9 9 0 0 0-6.364 15.364M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
                        },
                        {
                            label: 'Bot',
                            svg: 'M12 8V4H8M4 8h16M4 8v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M9 12h.01M15 12h.01',
                        },
                        {
                            label: 'Dashboard',
                            svg: 'M3 9h8V3H3v6zM3 21h9v-6H3v6zM13 21h8v-6h-8v6zM13 3v6h8V3h-8z',
                        },
                        {
                            label: 'Help Menu',
                            svg: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01',
                        },
                        {
                            label: 'Trophy',
                            svg: 'M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22m14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2z',
                        },
                        {
                            label: 'BarChart',
                            svg: 'M18 20V10M12 20V4M6 20v-6',
                        },
                        {
                            label: 'Medal',
                            svg: 'M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15M11 12 5.12 2.2M13 12l5.88-9.8M8 7h8M12 12v8M8 22h8',
                        },
                        {
                            label: 'Users',
                            svg: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
                        },
                        {
                            label: 'Settings',
                            svg: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
                        },
                    ].map(icon => (
                        <div key = {icon.label} className="flex flex-col items-center gap-1.5">
                            <svg xmlns = "https://www.w3.org/2000/svg" width= "24" height= "24" viewBox = "0 0 24 24" fill="none" stroke = "#530a23" strokeWidth= "2" strokeLinecap = "round" strokeLinejoin = "round">
                                <path d={icon.svg}/>
                            </svg>
                            <span className="text-xs text-gray-400">{icon.label}</span> 
                        </div>
                    ))}
                </div>
                
                {/*Rules for the Lucide React*/}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                        'Always use outline style - never filled',
                        'Color via Tailwind text',
                        'Stroke weight: 2px default',
                        'If using filled, never mix filled and outline in the same context',
                        'Import individually: import { Search } from "lucide-react";'
                    ].map(rule => (
                        <p key = {rule} className="text-xs text-gray-500 leading-relaxed">- {rule}</p>
                    ))}
                </div>
            </div>

            {/*The PNGs for the thematic stuff */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Thematic Assets - Custom PNGs</p>
            <div className="border border-gray-100 rounded-xl p-5">
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    Thematic assets that define the robots in space identity. These are not interchangeable with the UI icons. Located in {' '}
                    <code className = "text-[#530a23] bg-gray-50 px-1.5 py-0.5 rounded text-xs">src/assets/</code>
                </p>
                
                {/*A list of the custom PNGs*/}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
                    {[
                        {
                            folder: 'assets/Robots/',
                            files: 'HelloRobot_Pink, Pink_fighting, Pink_celebrate, arms_up',
                            use: 'Welcome page mascot, dashboard avatar, match screens',
                        },
                        {
                            folder: 'assets/Planets/',
                            files: 'Earth',
                            use: 'SignIn page - bottom beam source',
                        },
                        {
                            folder: 'assets/Background/',
                            files: 'dashboard, SignInBeam, SignUpBeam, SymbolBackground',
                            use: 'Page backgrounds and light beam effects',
                        },
                        {
                            folder: 'assets/Avatar/', //This will get removed/replaced cause its the old match screen. I also left out assets/Logo/ cause its old
                            files: 'blue_avatar, placeholder, purple_avatar',
                            use: 'The match screen avatars',
                        },
                        {
                            folder: 'assets/Decor/',
                            files: 'door, RedUFO',
                            use: 'Thematic decor',
                        },
                    ].map(asset => (
                        <div key = {asset.folder} className="bg-gray-50 rounded-lg p-4">
                            <code className="text-xs text-[#530a23] block mb-1">{asset.folder}</code>
                            <p className="text-xs text-gray-700 font-medium mb-1">{asset.files}</p>
                            <p className="text-xs text-gray-400">{asset.use}</p>
                        </div>
                    ))}
                </div>

                <div className="flex flex-wrap gap-3 mb-5">
                    {[
                        {
                            size: 'w-[480px]',
                            use: 'Hero assets - UFO, planet, robot',
                        },
                        {
                            size: 'w-full h-full object-cover',
                            use: 'Full page backgrounds',
                        },
                        {
                            size: 'w-[220px]',
                            use: 'Mid sized decorative assets',
                        },
                    ].map(item => (
                        <div key = {item.size} className="border border-gray-100 rounded-lg px-4 py-2">
                            <p className="text-xs font-semibold text=[#530a23]">{item.size}</p>
                            <p className="text-xs text-gray-400">{item.use}</p>
                        </div>
                    ))}
                </div>

                <div className ="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                        'Include a descriptive alt attribute',
                        'Use mix-blend-screen or mix-blend-mode to remove backgrounds',
                        'Use object-contain to prevent distortion',
                        'Use object-cover for full page backgrounds',
                        'Do not upscale PNGs beyond their natural resolution',
                        'Do not use thematic assets as UI icons',
                        'Do not change the transformations or scales of source images',
                    ].map(rule => (
                        <p key={rule} className="text-xs text-gray-500 leading-relaxed">- {rule}</p>
                    ))}
                </div>
            </div>
        </SharedLayout>
    );
};

export default LogoSection;