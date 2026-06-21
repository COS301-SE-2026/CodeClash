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


const navItems = [

    {
        label: 'Section1',
        items: [
            { to: '/dashboard', label: 'Dashboard' },
            { to: '/game-guide', label: 'Game Guide' },
        ]

    },

    {
        label: 'Section2',
        items: [
            { to: '/tournaments', label: 'Tournaments' },
            { to: '/Leaderboard', label: 'Leaderboard' },
            { to: '/badges', label: 'Badges' }
        ]
    },
    {
        label: 'Section3',
        items: [
            { to: '/friends', label: 'Friends' }
        ]
    }
]

const AppSidebarGroups = () => {
    return (
        <>
            {navItems.map((group) => (
                <SidebarGroup key={group.label}>
                    <SidebarMenu>
                        {group.items.map((item) => (
                            <SidebarMenuItem key={item.to}>
                                <SidebarMenuButton asChild>
                                    <Link to={item.to}>
                                        <span>{item.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </>
    )
}

export function AppSidebar() {
    return (
        <Sidebar collapsible='icon' className='bg-black text-white'>
            <SidebarHeader className='text-l font-semibold'>CODECLASH</SidebarHeader>
            <SidebarContent>
                <AppSidebarGroups></AppSidebarGroups>
            </SidebarContent>

            <SidebarFooter>
                <Link to='/settings'>Settings</Link>
            </SidebarFooter>
            <SidebarRail className='bg-black' />
        </Sidebar>
    )
}