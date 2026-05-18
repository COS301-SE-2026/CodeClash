import type React from "react"
import { Editor } from "@monaco-editor/react";

interface ProgMatchProps{
    language: string;
}

const ProgMatch: React.FC<ProgMatchProps> = ({language}) => {

    return (
        <div>
            <Editor height='90vh' defaultLanguage={language} defaultValue="// Your Answer Here"></Editor>
        </div >
    )
}

export default ProgMatch;