import { Editor } from "@monaco-editor/react"
import { useRef } from "react"

interface codeEditorProps {
    handleChange: () => void
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
                onChange={handleChange}

                onMount={(editor: any, monaco: any) => {
                    editorRef.current = editor;
                    monaco.editor.defineTheme("default", {
                        base: "vs",
                        //     inherits: true,
                        //     // rules: [
                        //     //     {
                        //     //         token: "identifier",
                        //     //         foreground: "#000000"
                        //     //     },
                        //     //     {
                        //     //         token: "type",
                        //     //         foreground: "#ffffff"
                        //     //     }
                        //     // ]
                    });

                    // monaco.editor.setTheme("default");
                    // editor.updateOptions({});
                }}

            />
    )
}