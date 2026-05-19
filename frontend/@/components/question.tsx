import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "./ui/badge"

function Question({
    className,
    size = "default",
    children,
    difficulty,
    title,
    ...props
}: React.ComponentProps<"div"> & {
    size?: "default" | "sm",
    children?: React.ReactNode,
    difficulty: string,
    title: string,
}) {
    return (
        <div className={cn("flex flex-col justify-between bg-white rounded-2xl", className)}>

            {/* bar at the top */}
            <div className="bg-gradient-to-r from-[#0C3883] to-[#D2C4FD] h-5 w-[100%] rounded-2xl shadow-[0_4px_6px_rgba(0,0,0,0.3)]"></div>


            <div className="flex flex-col p-2">

                <div className="flex justify-between w-full">
                    <p className="font-bold text-2xl">Question #</p>
                    <Badge className="w-[10%] h-[70%] text-white text-xl"
                        variant={"secondary"}
                    >{difficulty}</Badge>
                </div>

                <div className="p-5">
                    {/* This will be replaced by a question ui component  */}
                    <h1 className="text-6xl font-semibold"> &lt; / &gt; {title}</h1>
                    <p>Players will have to write or evaluate some code</p>

                    <div>
                        Some questions will have given code and ask players to provide the correct output. <br></br>
                        Other question will give a small scenario and ask players to write the code that will solve some problem
                    </div>

                </div >




            </div>

            {children}
        </div>
    )
}

export {
    Question
}
