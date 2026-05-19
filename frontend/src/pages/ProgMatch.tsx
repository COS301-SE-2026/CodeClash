import React, { useState } from "react";
import { Editor } from "@monaco-editor/react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useTimer } from "react-timer-hook";
import { Question } from "@/components/question";

interface ProgMatchProps {
    language: string;
}


const ProgMatch: React.FC<ProgMatchProps> = ({ language }) => {

    // LifeBar 
    const [input, set_input] = useState("");
    const [player_1_progress, set_player_1_progress] = useState(90);
    const [player_2_progress, set_player_2_progress] = useState(100);

    function handleChange(value: any) {
        set_input(value);
    }


    // Countdown
    const [duration, set_duration] = useState<number>(5);

    const expiryTime = () => {
        const time = new Date();
        time.setSeconds(time.getSeconds() + (duration * 60));
        return time;
    }

    const { seconds, minutes } = useTimer({ expiryTimestamp: expiryTime() });


    // Data sent to backend - NOT CONNECTED RIGHT NOW

    function submit() {
        console.log(input);
    }

    return (
        <div className="flex">
            <div className="flex flex-col w-[90%] mx-auto m-2">
                {/* header */}
                <div className="flex w-full justify-between items-center  m-2 p-4 rounded-3xl">

                    {/* Player 1 Progress */}
                    <div className="w-[40%] flex flex-col items-start justify-between h-full ">
                        <Progress className=" w-full h-7 shadow-[0_4px_6px_rgba(0,0,0,0.3)]"
                            value={player_1_progress}
                            progress_colour="var(--primary)"
                        ></Progress>
                        <Badge className="bg-white badge-font" >
                            <img></img>
                            User 1

                        </Badge>
                    </div>

                    {/* Clock */}
                    <div className="w-[15%] h-20 flex items-center justify-center text-4xl font-semibold border-b-1 border-t-1 rounded-2xl" >
                        <span>
                            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                        </span>
                    </div>

                    {/* Player 2 Progress */}
                    <div className="w-[40%] flex flex-col items-end justify-between h-full">
                        <Progress className=" w-full h-7 scale-x-[-1]"
                            value={player_2_progress}
                            progress_colour="var(--primary)"></Progress>
                        <Badge className="bg-white badge-font" >
                            <img></img>
                            User 2
                        </Badge>
                    </div>

                </div>

                {/* Question */}

                <Question
                    className="relative z-0"
                    difficulty="Easy"
                    title="Array Sum"
                >
                    <Editor
                        height="60vh"
                        width="70vh"
                        defaultLanguage={language}
                        defaultValue="// Your code here"
                        onChange={handleChange}
                        onMount={(editor: any, monaco: any) => {
                            monaco.editor.defineTheme('default', {
                                base: 'vs',
                                'inherits': true,
                                rules: [
                                    {
                                        token: "identifier",
                                        foreground: '#9CDCFE'
                                    },
                                    {
                                        token: "type",
                                        foreground: "#1AAFB0"
                                    },
                                ],
                                colors: {
                                    'editor.background': '#a7a7a7',
                                }
                            });
                            monaco.editor.setTheme('default')
                        }}

                    />
                </Question>
            </div >
            <div className="bg-green-600">
                <div>Progress bar</div>
            </div>

        </div>
    )
}

export default ProgMatch;