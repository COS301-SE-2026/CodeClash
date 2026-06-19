import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <SidebarProvider className="bg-black">
            <AppSidebar />
                <SidebarTrigger className="text-white" />
                <Outlet />
        </SidebarProvider>
    )
}