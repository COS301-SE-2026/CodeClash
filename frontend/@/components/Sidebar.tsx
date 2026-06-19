import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader
} from '@/components/ui/sidebar'
import { Link } from 'react-router-dom'

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>CODECLASH</SidebarHeader>
            <SidebarContent>

                {/* Section 1 */}
                <SidebarGroup>
                    <Link to='/dashboard'>
                        <img />
                        Dashboard
                    </Link>
                    <Link to='/game-guide'>
                        <img />
                        Game Guide
                    </Link>
                </SidebarGroup>

                {/* Section 2 */}
                <SidebarGroup>
                    <Link to='/tournaments'>
                        <img />
                        Tournamnets
                    </Link>
                    <Link to='/leaderboard'>
                        <img />
                        LeaderBoard
                    </Link>
                    <Link to='/badges'>
                        <img />Badges
                    </Link>
                </SidebarGroup>

                {/* Section c */}
                <SidebarGroup>
                    <Link to='/friends'>
                        <div>
                            <img/>
                            Friends
                        </div>

                        <div>Most Played Friends List</div>

                    </Link>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <Link to='/settings'>Settings</Link>
            </SidebarFooter>
        </Sidebar>
    )
}