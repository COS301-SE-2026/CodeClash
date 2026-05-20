 
import type { QuestionDTO, MatchDTO } from "src/types/question.dto";
import door from '../../src/assets/door.png'
import { Badge } from "./ui/badge";
 
 function MatchProgress({
    className,
    size = "default",
    children,
    questions,
    ...props
}: React.ComponentProps<"div"> & {
    size?: "default" | "sm",
    children?: React.ReactNode,
    questions: QuestionDTO[],
}) {
    return (
        <div className="bg-white m-4 flex flex-row rounded-3xl w-[15%] h-[90%] m-auto">
                <Badge className="bg-white badge-font shadow-badge " ></Badge>
                <div className=""></div>
                <div className="flex flex-col items-end justify-evenly">
                    {questions?.map((q, id) => (
                        <img key={id} src={door} className="w-[50%] " ></img>

                    ))}
                </div>
            </div>
    )
}

export {
    MatchProgress
}
