import { Editor } from "@monaco-editor/react"
import { useRef } from "react"

interface codeEditorProps {
    handleChange: (value: string) => void
    className?: string
}

export const CodeEditor = ({ handleChange, className }: codeEditorProps) => {
    const placeholder = "Enter your code solution here";
    const editorRef = useRef<any>(null);

    return (
        <Editor
            height="20vh"
            width="90%"
            defaultLanguage="Java"
            defaultValue={placeholder}
            onChange={(value) => handleChange(value ?? '')}

            onMount={(editor: any) => {
                editorRef.current = editor;
            }}

            className={className}

        />
    )
}