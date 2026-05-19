import React, { useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTimer } from "react-timer-hook";

interface ProgMatchProps {
    language: string;
}


const ProgMatch: React.FC<ProgMatchProps> = ({ language }) => {

    // LifeBar 
    const [input, set_input] = useState("");
    const [player_1_progress, set_player_1_progress] = useState(0);
    const [player_2_progress, set_player_2_progress] = useState(0);

    function handleChange(value: any) {
        set_input(value);
        console.log(value);
    }


    // Countdown
    const [duration, set_duration] = useState<number>(5);

    const expiryTime = () => {
        const time = new Date();
        time.setSeconds(time.getSeconds() + (duration * 60));
        return time;
    }

    const { seconds, minutes } = useTimer({ expiryTimestamp: expiryTime() });


    return (
        <div className="fixed inset-0 flex flex-col w-[95%] mx-auto m-2">
            {/* header */}
            <div className="flex w-full justify-between items-center shadow-[0_9px_32px_rgba(0,0,0,0.2)] m-2 p-4 rounded-3xl">

                {/* Player 1 Progress */}
                <div className="w-[40%] flex flex-col items-start justify-between h-full">
                    <Progress className=" w-full h-10"
                        value={100}
                        progress_colour="var(--primary)"
                    ></Progress>
                    <Badge className="bg-white badge-font" >
                        <img></img>
                        User 1

                    </Badge>
                </div>

                {/* Clock */}
                <div className="w-[15%]">
                    <Card className="h-20 flex items-center justify-center text-4xl">
                        <span>
                            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                        </span>
                    </Card>
                </div>

                {/* Player 2 Progress */}
                <div className="w-[40%] flex flex-col items-end justify-between h-full">
                    <Progress className=" w-full h-10 scale-x-[-1]" value={100} progress_colour="var(--secondary)"></Progress>
                    <Badge className="bg-white badge-font" >
                        <img></img>
                        User 2
                    </Badge>
                </div>

            </div>
            <div className="flex flex-row flex-1 w-full h-full justify-between items-center">
                <div className="flex flex-col items-center">
                    {/* User and question difficulty */}
                    <div className="flex justify-between w-full">
                        <p>User 1's Challenge</p>
                        <div>
                            {/* this div will need to be changed to the ui component we use for difficulty tags */}
                            Easy
                        </div>
                    </div>
                    {/* Question - this will also be replaced by a question div ui component*/}
                    <div>
                        {/* This will be replaced by a question ui component  */}
                        <h1> &lt; / &gt; Coding Question</h1>
                        <p>Players will have to write or evaluate some code</p>

                        <div>
                            Some questions will have given code and ask players to provide the correct output. <br></br>
                            Other question will give a small scenario and ask players to write the code that will solve some problem
                        </div>

                    </div >

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


                </div>
                <div>Progress bar</div>
            </div>


        </div >
    )
}

export default ProgMatch;