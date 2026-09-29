import { Editor } from "@monaco-editor/react"
import { type TemplateDTO } from "src/dtos/match/match.dto"
import { useCodeQuestion } from "src/services/code-question.service";
import { Button } from "../ui/button";

const LANGUAGES: Record<string, string> = {
    cpp: "cpp",
};


interface codeEditorProps {
    question: { templates?: TemplateDTO[] },
    onChange: (code: string, judge0_language_id: number) => void
}

export const CodeEditor = ({ question, onChange }: codeEditorProps) => {

    const { templates, selectedLanguage, code, changeLanguage, editCode } = useCodeQuestion(question, onChange);


    return (

        <div className="flex flex-col h-full w-full">
            <div className="flex gap-2 mb-2">
                {templates.map(t => (
                    <Button
                        key={t.language}
                        onClick={() => changeLanguage(t.language)}
                        variant={"ghost"}
                    >
                        {t.language}
                    </Button>
                ))
                }
            </div>
            <Editor
                height="20vh"
                language={LANGUAGES[selectedLanguage] ?? selectedLanguage}
                value={code}
                width="90%"
                onChange={(v) => editCode(v ?? "")}
            />

        </div>
    )
}