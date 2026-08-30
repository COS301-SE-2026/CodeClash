/*This file owns an empty slot in the heder that can get filled by anything specific to a page, 
like the search usernames/friends in the friends system. Also has sidebar. */

import { Outlet, Link } from "react-router-dom";
import { AppSidebar } from "@/components/Sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar/sidebar";
import {Bot, UserCircle} from 'lucide-react';
import React from "react";
import { useMemo, useState } from "react";
import type { OutletContext } from "./extra-layout";
import { useFriends } from "./context/Friends/useFriends";

export default function Layout() {
    const {activeInvite} = useFriends();
    const [layoutExtra, setExtra] = useState<React.ReactNode>(null); //whatever renders in place of the headers previous search bar will be owned by that page that is curr active
    const outletContext = useMemo<OutletContext>(() => ({setExtra}), []);

    return (
        <SidebarProvider className="bg-background">
            <AppSidebar />
            <SidebarInset>
                    <div className='flex flex-col min-h-screen'>
                        <header className='w-full flex items-center justify-between gap-4 px-8 py-4 border-b border-border bg-background/60 backdrop-blur-md'>
                            <div className='flex items-center gap-3 w-full max-w-md'>
                                <SidebarTrigger className='btn btn-ghost btn-icon shrink-0' />
                                {layoutExtra}
                            </div>
                            <div className="flex items-center gap-2 shrink-0 rounded-full border border-border bg-card pl-1 pr-1.5 py-1">
                                <Link to="/agent" className="btn btn-ghost btn-icon" aria-label="CodeClash AI Agent" type="button">
                                    <Bot size={20}/>
                                </Link>
                                <span className="w-px h-6 bg-border"/>
                                <Link to="/profile" className="avatar w-9 h-9 flex items-center justify-center overflow-hidden">
                                <UserCircle size={22} className="text-muted-text"/>
                                {activeInvite && (
                                    <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-danger border-2 border-background"/>
                                )}
                                </Link>
                            </div>
                        </header>
                        <main className="flex-1 px-8 py-8">
                            <Outlet context={outletContext}/>
                        </main>
                    </div>
            </SidebarInset>
        </SidebarProvider>
    )
}