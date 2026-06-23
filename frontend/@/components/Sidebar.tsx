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

import pink_astronaut from '../../src/assets/Logo/pink_astronaut.png'
import dashboard_icon from '../../src/assets/Icons/dashboard.png'
import leaderboard_icon from '../../src/assets/Icons/leaderboard.png'
import game_guide_icon from '../../src/assets/Icons/game_guide.png'
import tournaments_icon from '../../src/assets/Icons/trophy.png'
import badges_icon from '../../src/assets/Icons/badges.png'
import friends_icon from '../../src/assets/Icons/friends.png'


const navItems = [

    {
        label: 'Section1',
        items: [
            { to: '/dashboard', label: 'Dashboard', img: dashboard_icon },
            { to: '/game-guide', label: 'Game Guide', img: game_guide_icon },
        ]

    },

    {
        label: 'Section2',
        items: [
            { to: '/tournaments', label: 'Tournaments', img: tournaments_icon },
            { to: '/leaderboard', label: 'Leaderboard', img: leaderboard_icon },
            { to: '/badges', label: 'Badges', img: badges_icon }
        ]
    },
    {
        label: 'Section3',
        items: [
            { to: '/friends', label: 'Friends', img: friends_icon }
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
                            <SidebarMenuItem key={item.to} className=' w-[100%] flex justify-center'>
                                <SidebarMenuButton asChild className='w-[100%]'>
                                    <Link to={item.to} className='w-[100%]' >
                                        <img src={item.img} alt={item.label} className='w-[2rem]' />
                                        <span className='group-data-[state=collapsed]:hidden'>{item.label}</span>
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
                <Link to='/settings'>Settings</Link>
            </SidebarFooter>
            <SidebarRail className='hidden' />
        </Sidebar>
    )
}