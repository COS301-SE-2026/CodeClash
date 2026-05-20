import React, { useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useTimer } from "react-timer-hook";
import { Question } from "@/components/question";
import { Sidebar, SidebarContent, SidebarProvider } from "@/components/ui/sidebar";
import blue_avatar from '../assets/blue_avatar.jpeg'
import puprle_avatar from '../assets/purple_avatar.jpeg'

import type { QuestionDTO, MatchDTO } from "src/types/question.dto";
import { mock_questions } from "../mocks/prog-questions.mock";
import { MatchProgress } from "@/components/match-progress";

interface ProgMatchProps {
    language: string;
    match: MatchDTO;
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


    // questions
    const [questions, set_questions] = useState<QuestionDTO[]>();

    // initialise questions
    useEffect(() => {
        set_questions(mock_questions);
    }, [])


    // Data sent to backend - NOT CONNECTED RIGHT NOW

    function submit() {
        console.log(input);
    }

    return (
        <div className="fixed inset-0 flex flex-row p-2 ">
            <div className="flex flex-col w-[80%] m-2 justify-between ">
                {/* header */}
                <div className="flex w-full h-[20%] justify-between items-center m-1 p-2">

                    {/* Player 1 Progress */}
                    <div className="w-[40%] flex flex-col items-start h-[60%] justify-center self-end ">
                        <Progress className=" w-full h-7 shadow-[0_4px_6px_rgba(0,0,0,0.3)]"
                            value={player_1_progress}
                            progress_colour="var(--primary)"
                        ></Progress>
                        <div className="flex w-[50%] h-[60%] items-center m-2">
                            <img src={blue_avatar} alt="user one avatar" className="h-[120%] flex items-center"></img>
                            <Badge className="bg-white badge-font" >
                                User 1
                            </Badge>
                        </div>

                    </div>

                    {/* Clock */}
                    <div className="w-[15%] h-20 flex items-center justify-center text-4xl font-semibold border-b-1 border-t-1 rounded-2xl" >
                        <span>
                            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                        </span>
                    </div>

                    {/* Player 2 Progress */}
                    <div className="w-[40%] flex flex-col items-end h-[60%] justify-center self-end ">
                        <Progress className=" w-full h-7 scale-x-[-1] shadow-[0_4px_6px_rgba(0,0,0,0.3)]"
                            value={player_2_progress}
                            progress_colour="var(--primary)"></Progress>
                        <div className="flex w-[50%] h-[60%] items-center justify-end m-2">
                            <Badge className="bg-white badge-font" >
                                User 2
                            </Badge>
                            <img src={puprle_avatar} alt="user one avatar" className="h-[120%] flex items-center "></img>
                        </div>
                    </div>

                </div>

                {/* Question */}
                <Question
                    className="relative z-0"
                    difficulty="Easy"
                    title="Array Sum"
                    question="What will be the output of this code?"
                >
                    <Editor
                        height="50vh"
                        width="110vh"
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
                                    'editor.background': '#c4c4c4',
                                }
                            });
                            monaco.editor.setTheme('default');
                            editor.updateOptions({
                            })
                        }}

                    />
                </Question>
            </div >
           
           <MatchProgress></MatchProgress>

        </div>
    )
}

export default ProgMatch;