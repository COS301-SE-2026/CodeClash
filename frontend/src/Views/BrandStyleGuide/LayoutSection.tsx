// This is the layout and spacings section for the brand style guide - to ensure that the UI will be consistent - correct file

import React from "react";
import SharedLayout from "./SharedLayout";
import type { BrandStyleGuideContent } from "../../Models/BrandStyleGuideModel";

interface Props {
    content: BrandStyleGuideContent;
}

const LayoutSection: React.FC<Props> = () => {
    return (
        <SharedLayout
            id = "layout" eyebrow="06 - Layout & Spacing" title = "Grid & Spacing" description="The system uses three distinct layout patterns - auth pages, the welcome page, and the dashboard. All share the same spacing scale and token system.">
            
            {/*Page Layouts */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Page Layout Patterns</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                {[
                    {
                        name: 'Auth Pages',
                        pages: 'SignIn, SignUp',
                        descrp: 'Single centered column, max width 560px, vertical flex with gap-4. Thematic assets (UFO and planet) either above or below the form. Full screen height with overflow-x-hidden.',
                        wireframe: '', //can i use an image here?
                    },
                ].map(layout => (
                    <div key ={layout.name} className="border border-gray-100 rounded-xl p-5">
                        <p className="text-sm font-bold text-gray-900 mb-1">{layout.name}</p>
                        <p className="text-xs text=[#530a23] mb-3">{layout.pages}</p>
                        <p className="text-xs text-gray-500 leading-relaxed mb-4">{layout.descrp}</p>
                        {/*Wireframe part here once decided */}
                    </div>
                ))}
            </div>

            {/*The sidebar */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Sidebar Navigation</p>
            <div className="border border-gray-100 rounded-xl p-5 mb-10">
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    The sidebar is implemented via shadcn's{' '}
                    <code className="text-[#530a23] bg-gray-50 px-1.5 py-0.5 rounded text-xs">SidebarProvider</code>{' '}
                    and{' '}
                    <code className="text-[#530a23] bg-gray-50 px-1.5 py-0.5 rounded text-xs">AppSidebar</code>{' '}
                    component. It wraps all authenticated routes via the{' '}
                    <code className="text-[#530a23] bg-gray-50 px-1.5 py-0.5 rounded text-xs">Layout</code>{' '}
                    component in
                    <code className="text-[#530a23] bg-gray-50 px-1.5 py-0.5 rounded text-xs">layout.tsx</code>
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                        {
                            route: '/dashboard',
                            label: 'Dasboard',
                        },
                        {
                            route: '/game-guide',
                            label: 'Game Guide',
                        },
                        {
                            route: '/tournaments',
                            label: 'Tournaments',
                        },
                        {
                            route: '/leaderboard',
                            label: 'Leaderboard',
                        },
                        {
                            route: '/badges',
                            label: 'Badges',
                        },
                        {
                            route: '/friends',
                            label: 'Friends'
                        }
                    ].map(item => (
                        <div key = {item.route} className="bg-gray-50 rounded-lg px-4 py-2">
                            <p className="text-xs font-semibold text-gray-700">{item.label}</p>
                            <code className="text-xs text-[#530a23]">{item.route}</code>
                        </div>
                    ))}
                </div>
            </div>

            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Spacing Scale</p>
            <div className="border border-gray-100 rounded-xl overflow-hidden">
                {[
                    {
                        name: 'xs',
                        value: '0.25rem',
                        px: '4px',
                        example: 'Icon gaps',
                    },
                    {
                        name: 'sm',
                        value: '0.5rem',
                        px: '8px',
                        example: 'Tight padding',
                    },
                    {
                        name: 'md',
                        value: '1rem',
                        px: '16px',
                        example: 'Component padding',
                    },
                    {
                        name: 'lg',
                        value: '1.5rem',
                        px: '24px',
                        example: 'Card padding, section gaps',
                    },
                    {
                        name: 'xl',
                        value: '2rem',
                        px: '32px',
                        example: 'Page padding, large gaps',
                    },
                    {
                        name: 'xxl',
                        value: '3rem',
                        px: '48px',
                        example: 'Section margins',
                    },
                ].map((s, i, arr) => (
                    <div key = {s.name} className= {`flex items-center gap-4 px-4 py-3 ${i< arr.length -1 ? 'border-b border-gray-50' : ''}`}>
                        <code className="text-xs text-gray-400 w-8 flex-shrink-0">{s.name}</code>
                        <div className="bg-[#530a23] rounded h-3 flex-shrink-0" style = {{width: s.px}}/>
                        <code className="text-xs text-gray-500 w-16 flex-shrink-0">{s.value}</code>
                        <code className="text-xs text-gray-300 w-10 flex-shrink-0">{s.px}</code>
                        <p className="text-xs text-gray-400">{s.example}</p>
                    </div>
                ))}
            </div>
        </SharedLayout>
    );
};

export default LayoutSection;