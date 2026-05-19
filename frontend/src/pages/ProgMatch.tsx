import React, { useState } from "react";
import { Editor } from "@monaco-editor/react";
import LifeBar from "../components/Match/LifeBar";

interface ProgMatchProps {
    language: string;
}


const ProgMatch: React.FC<ProgMatchProps> = ({ language }) => {

    const [input, setInput] = useState("");
    function handleChange(value: any) {
        setInput(value);
        console.log(value);


    }


    return (
        <div className=" flex flex-col ">
            <LifeBar
                life={30}
                user_name="User 1"
            ></LifeBar>

           

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
                        height="40vh"
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