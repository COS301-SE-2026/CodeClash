import { LayoutDashboard, HelpCircle, Trophy, BarChart2, Medal, Users, Settings, History } from 'lucide-react'
import { Link } from 'react-router-dom'

import pink_astronaut from '../../src/assets/Robots/pink_celebrate.png'


import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarRail
} from '@/components/ui/sidebar/sidebar'


const navItems = [

    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/match-history', label: 'Match History', icon: History},
    { to: '/tournaments', label: 'Tournaments', icon: Trophy },
    { to: '/leaderboard', label: 'Leaderboard', icon: BarChart2 },
    { to: '/badges', label: 'Badges', icon: Medal },
    { to: '/friends', label: 'Friends', icon: Users },
    { to: '/help-menu', label: 'Help Menu', icon: HelpCircle},
]


export function AppSidebar() {
    return (
        <Sidebar collapsible='icon' className='bg-black text-white'>
            <SidebarHeader className='text-l font-semibold'>
                <span className='group-data-[state=collapsed]:hidden transition-property'>CODECLASH</span>
                <span className='h-[100%] flex justify-center hidden group-data-[state=collapsed]:flex w-[3rem]'>
                    <img src={pink_astronaut} alt='pink astronaut logo' className='h-[100%]' />
                </span>
            </SidebarHeader>
            <SidebarContent className='flex-1'>
                <SidebarMenu className='flex h-full flex-col justify-evenly px-2'>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <SidebarMenuItem key = {item.to}>
                                <SidebarMenuButton asChild className='w-[100%]'>
                                    <Link to={item.to}>
                                        <Icon className='flex-shrink-0'/>
                                        <span className='group-data-[state=collapsed]:hidden'>{item.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    })}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className='pb-4'>
                <SidebarMenu>
                    <SidebarMenuItem className='w-[100%] flex justify-center'>
                        <SidebarMenuButton asChild size="lg" className='w-[100%]'>
                            <Link to='/settings' className='text-sm'>
                                <Settings className='flex-shrink-0'/>
                                <span className='group-data-[state=collapsed]:hidden'>Settings</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail className='hidden' />
        </Sidebar>
    )
}