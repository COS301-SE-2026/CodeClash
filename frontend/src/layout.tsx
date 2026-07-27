import { Outlet } from "react-router-dom";

import { AppSidebar } from "@/components/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar/sidebar";

export default function Layout() {
    return (
        <SidebarProvider className="bg-black">
            <AppSidebar />
                <SidebarTrigger className="text-white" />
                <Outlet />
        </SidebarProvider>
    )
}