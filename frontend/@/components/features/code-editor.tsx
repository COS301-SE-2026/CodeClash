import { Editor } from "@monaco-editor/react"
import { useRef } from "react"

interface codeEditorProps {
    handleChange: (value: string) => void
}

export const CodeEditor = ({ handleChange }: codeEditorProps) => {
    const placeholder = "Enter your code solution here";
    const editorRef = useRef<any>(null);

    return (
        <Editor
            height="20vh"
            width="100%"
            defaultLanguage="Java"
            defaultValue={placeholder}
            onChange={(value) => handleChange(value ?? '')}

            onMount={(editor: any) => {
                editorRef.current = editor;
            }}

        />
    )
}