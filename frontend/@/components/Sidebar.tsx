import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarRail
} from '@/components/ui/sidebar'
import { Link } from 'react-router-dom'

import pink_astronaut from '../../src/assets/Robots/pink_celebrate.png'
import { LayoutDashboard, BookOpen, Trophy, BarChart2, Medal, Users, Settings } from 'lucide-react';

const navItems = [

    {
        label: 'Section1',
        items: [
            { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { to: '/game-guide', label: 'Game Guide', icon: BookOpen },
        ]

    },

    {
        label: 'Section2',
        items: [
            { to: '/tournaments', label: 'Tournaments', icon: Trophy },
            { to: '/leaderboard', label: 'Leaderboard', icon: BarChart2 },
            { to: '/badges', label: 'Badges', icon: Medal }
        ]
    },
    {
        label: 'Section3',
        items: [
            { to: '/friends', label: 'Friends', icon: Users }
        ]
    }
]

const AppSidebarGroups = () => {
    return (
        <>
            {navItems.map((group) => (
                <SidebarGroup key={group.label}>
                    <SidebarMenu>
                        {group.items.map((item) => {
                            const Icon = item.icon;
                            return (
                            <SidebarMenuItem key={item.to} className=' w-[100%] flex justify-center'>
                                <SidebarMenuButton asChild className='w-[100%]'>
                                    <Link to={item.to} className='w-[100%]' >
                                        <Icon className='w-5 h-5 flex-shrink-0' />
                                        <span className='group-data-[state=collapsed]:hidden text-sm'>{item.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </>
    )
}

export function AppSidebar() {
    return (
        <Sidebar collapsible='icon' className='bg-black text-white'>
            <SidebarHeader className='text-l font-semibold'>
                <span className='group-data-[state=collapsed]:hidden transition-property'>CODECLASH</span>
                <span className='h-[100%] flex justify-center hidden group-data-[state=collapsed]:flex w-[3rem]'>
                    <img src={pink_astronaut} alt='pink astronaut logo' className='h-[100%]' />
                </span>
            </SidebarHeader>
            <SidebarContent>
                <AppSidebarGroups></AppSidebarGroups>
            </SidebarContent>

            <SidebarFooter>
                <Link to='/settings' className='text-sm'>Settings</Link>
            </SidebarFooter>
            <SidebarRail className='hidden' />
        </Sidebar>
    )
}