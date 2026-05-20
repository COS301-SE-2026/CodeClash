
import type { QuestionDTO, MatchDTO } from "src/types/question.dto";
import door from '../../src/assets/door.png'
import { Badge } from "./ui/badge";
import React from "react";

function MatchProgress({
    className,
    size = "default",
    children,
    questions,
    avatar,
    opponent,
    progress,
    opponent_progress,
    done,
    ...props
}: React.ComponentProps<"div"> & {
    size?: "default" | "sm",
    children?: React.ReactNode,
    questions: QuestionDTO[],
    avatar: string,
    opponent: string,
    progress: number,
    opponent_progress: number,
    done: boolean,
}) {
    return (
        <div className="relative bg-white flex flex-col rounded-3xl w-[15%] h-[98%] m-auto">
            <Badge className="bg-white badge-font shadow-badge self-center m-4 w-[40%] h-[5%] relative z-10 ">Finish</Badge>

            <div className="absolute top-5 self-center bg-black h-[75%] w-[2%] z-0"></div>
            <div className="grid grid-cols-3 flex-1 gap-2 items-center relative z-10">
                {
                    [...questions].reverse().map((q, id) => {
                        const door_id = questions.length -1 -id;
                        return (

                            <React.Fragment key={id} >
                                <div className="flex justify-center items-center h-16">
                                    {progress === door_id && <img src={avatar} className="w-20 h-20 object-cover rounded-full"></img>}
                                </div>

                                <div className="flex justify-center  items-center h-16">
                                    <img src={door} className="w-20 h-20 object-cover rounded-full"></img>
                                </div>
                                <div className="flex justify-center  items-center h-16">
                                    {opponent_progress === door_id && <img src={opponent} className="w-20 h-20 object-cover rounded-full"></img>}
                                </div>
                            </React.Fragment>
                        )
                    })
                }
            </div>
        </div>
    )
}

export {
    MatchProgress
}
