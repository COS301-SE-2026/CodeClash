import { LayoutDashboard, HelpCircle, Trophy, BarChart2, Medal, Users, Settings, History } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarRail,
    SidebarSeparator
} from '@/components/ui/sidebar/sidebar'

const navItems = [

    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/match-history', label: 'Match History', icon: History},
    { to: '/tournaments', label: 'Tournaments', icon: Trophy },
    { to: '/leaderboard', label: 'Leaderboard', icon: BarChart2 },
    { to: '/badges', label: 'Badges', icon: Medal },
    { to: '/friends', label: 'Friends', icon: Users },
    { to: '/help-menu', label: 'Help Menu', icon: HelpCircle},
    {to: '/settings', label: 'Settings', icon: Settings},
]

export function AppSidebar() {
    const {pathname} = useLocation();
    return (
        <Sidebar collapsible='icon' className='bg-sidebar text-sidebar-text border-r border-sidebar-border'>
            <SidebarHeader className='px-4 py-5'>
                <Link to='/dashboard' className='flex items-center justify-center group-data-[state=expanded]:justify-start gap-2'>
                    <span className='hidden group-data-[state=collapsed]:flex text-md items-center justify-center'
                        style={{fontFamily: 'var(--font-logo)', fontWeight: 900}}>
                        <span className='text-primary'>CC</span>
                    </span>
                    <span className='group-data-[state=collapsed]:hidden text-md tracking-wide whitespace-nowrap'
                        style={{fontFamily: 'var(--font-logo)', fontWeight: 900}}>
                        <span className='text-primary'>CODECLASH</span>
                    </span>
                </Link>
            </SidebarHeader>

            <SidebarContent className='flex-1 py-2'>
                <SidebarMenu className='flex h-full flex-col justify-evenly px-2'>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.to;
                        return (
                            <SidebarMenuItem key = {item.to}>
                                <SidebarMenuButton asChild isActive={isActive} className='w-full data-active:bg-primary/15 data-active:text-primary data-active:font-semibold'>
                                    <Link to={item.to}>
                                        <Icon className='flex-shrink-0 items-center justify-center'/>
                                        <span className='group-data-[state=collapsed]:hidden'>{item.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    })}
                </SidebarMenu>
            </SidebarContent>

            <SidebarSeparator/>
            <SidebarRail className='hidden' />
        </Sidebar>
    )
}