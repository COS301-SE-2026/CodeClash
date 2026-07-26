import React from "react"

import { type SidebarContextProps } from "./sidebar-context-props"


export const SidebarContext = React.createContext<SidebarContextProps | null>(null)
