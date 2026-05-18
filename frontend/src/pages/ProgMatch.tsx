import type React from "react"
import { Editor } from "@monaco-editor/react";

interface ProgMatchProps{
    language: string;
}

const ProgMatch: React.FC<ProgMatchProps> = ({language}) => {

    return (
        <div className="fixed inset-0 flex flex-col ">
            <div className="bg-gray-300 text-center p-8 m-20 h-20">Life Bars will go here</div>

            <div className="flex flex-row flex-1 w-full h-full justify-evenly">
                <div className="flex items-center">
                    <Editor height="70vh" width="70vh" defaultLanguage={language} defaultValue="// Your code here"  />
                </div>
                <div>Progress bar</div>
            </div>
           
            
        </div >
    )
}

export default ProgMatch;