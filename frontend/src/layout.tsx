import { Outlet, Link } from "react-router-dom";
import { AppSidebar } from "@/components/Sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar/sidebar";
import {Search, Bot, UserCircle} from 'lucide-react';

export default function Layout() {

    return (
        <SidebarProvider className="bg-background">
            <AppSidebar />
            <SidebarInset>
                    <div className='flex flex-col min-h-screen'>
                        <header className='w-full flex items-center justify-between gap-4 px-8 py-4 border-b border-border bg-background/60 backdrop-blur-md'>
                            <div className='flex items-center gap-3 w-full max-w-md'>
                                <SidebarTrigger className='btn btn-ghost btn-icon shrink-0' />
                                <div className="flex items-center gap-2 w-full rounded-3xl border border-border bg-card px-4 py-2.5">
                                    <Search size={18} className="text-muted-text shrink-0"/>
                                    <input type="text" placeholder="Search..." className="bg-transparent outline-none text-xsm text-primary-text placeholder:text-muted-text w-full"/>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 rounded-full border border-border bg-card pl-1 pr-1.5 py-1">
                                <Link to="/agent" className="btn btn-ghost btn-icon" aria-label="CodeClash AI Agent" type="button">
                                    <Bot size={20}/>
                                </Link>
                                <span className="w-px h-6 bg-border"/>
                                <Link to="/profile" className="avatar w-9 h-9 flex items-center justify-center overflow-hidden">
                                <UserCircle size={22} className="text-muted-text"/>
                                </Link>
                            </div>
                        </header>
                        <main className="flex-1 px-8 py-8">
                            <Outlet/>
                        </main>
                    </div>
            </SidebarInset>
        </SidebarProvider>
    )
}