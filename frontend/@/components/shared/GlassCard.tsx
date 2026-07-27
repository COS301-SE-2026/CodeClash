import type React from "react"

import { Card } from "../ui/card"


interface GlassCardProps {
    children?: React.ReactNode
    className?: string
}
const GlassCard = ({children, className}: GlassCardProps) => {
    return (
        <Card className={`bg-[#141414]/10 rounded-2xl backdrop-blur-sm border border-white/30
        ${className}
        `}>
            {children}
        </Card>
    )
}

export default GlassCard