import { Outlet } from "react-router-dom";
import backgroundImg from 'src/assets/Background/dashboard.png'
import { AppSidebar } from "@/components/Sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar/sidebar";
import { useMemo } from 'react';


const secureRandom = () => {
    const arr = new Uint32Array(1);
    window.crypto.getRandomValues(arr);
    return arr[0] / (0xffffffff + 1);
}

export default function Layout() {

    const stars = useMemo(
        () => Array.from({ length: 40 }, (_, i) => ({
            id: i, top: secureRandom() * 100, left: secureRandom() * 100, delay: secureRandom() * 3,
        })), []
    )

    return (
        <SidebarProvider className="bg-black">
            <AppSidebar />
            <SidebarInset>
                <div className='relative w-full min-h-screen bg-cover bg-center overflow-hidden'
                    style={{ backgroundImage: `url(${backgroundImg})` }}>
                    <div className='absolute inset-0 bg-gradient-to-b from-background/85 via-background/75 to-background' />
                    <div className="starfield">
                        {stars.map((star) => (
                            <span key={star.id} style={{ top: `${star.top}%`, left: `${star.left}%`, animationDelay: `${star.delay}s` }} />
                        ))}
                    </div>
                    <div className='relative z-10 flex flex-col min-h-screen'>
                        <header className='w-full flex items-center justify-between gap-4 px-8 py-4 border-b border-border bg-background/60 backdrop-blur-md'>
                            <div className='flex items-center gap-3 w-full max-w-md'>
                                <SidebarTrigger className='btn btn-ghost btn-icon shrink-0' />
                            </div>

                        </header>

                    </div>
                </div>
            </SidebarInset>
            <Outlet />
        </SidebarProvider>
    )
}