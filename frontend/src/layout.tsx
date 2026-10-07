/*This file owns an empty slot in the heder that can get filled by anything specific to a page, 
like the search usernames/friends in the friends system. Also has sidebar. */

import React,  { useMemo, useState} from "react";
import { Outlet, useNavigate } from "react-router-dom";

import type { OutletContext } from "./extra-layout";

import { AppSidebar } from "@/components/Sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar/sidebar";
import { useAuth } from "./context/Auth/hooks/useAuth";

export default function Layout() {
    const [layoutExtra, setExtra] = useState<React.ReactNode>(null); //whatever renders in place of the headers previous search bar will be owned by that page that is curr active
    const outletContext = useMemo<OutletContext>(() => ({setExtra}), []);
    const {signOut} = useAuth();
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await signOut();
            navigate("/sign-in", {replace: true});
        } catch (error) {
            console.error("Logout failed: ", error);
        }
    }

    return (
        <SidebarProvider className="bg-background">
            <AppSidebar />
            <SidebarInset className="min-w-0 overflow-x-hidden">
                    <div className='flex flex-col min-h-screen min-w-0 w-full overflow-x-hidden'>
                        <header className='relative z-50 w-full flex items-center justify-between gap-4 px-8 py-4 border-b border-border bg-sidebar backdrop-blur-md'>
                            <div className='flex items-center gap-3 w-full max-w-md'>
                                {layoutExtra}
                            </div>
                            <div className="flex items-center gap-2 shrink-0 rounded-full border border-border bg-card pl-1 pr-1.5 py-1">
                                <button onClick={handleLogout} className="btn btn-primary btn-sm">
                                    Log Out
                                </button>
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