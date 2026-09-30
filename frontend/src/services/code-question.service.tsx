import type { TemplateDTO } from "src/dtos/match/match.dto";
import { useEffect, useMemo, useState } from "react";


export const useCodeQuestion = (
    question: { templates?: TemplateDTO[] },
    onChange: (code: string, judge0_language_id: number) => void
) => {

    const templates: TemplateDTO[] = question.templates!;
    const [selectedLanguage, setSelectedLanguage] = useState(templates[0].language);
    const [code, setCode] = useState(templates[0].starter_code);


    const current = useMemo(() => templates.find(t => t.language === selectedLanguage) ?? templates[0], [templates, selectedLanguage]);

    useEffect(() => {
        const first = templates[0];
        setSelectedLanguage(first.language);
        setCode(first.starter_code);
    }, [question]);

    const changeLanguage = (lang: string) => {
        const template = templates.find(t => t.language === lang);
        if (!template) return;

        setSelectedLanguage(lang);
        setCode(template.starter_code);
        onChange(template.starter_code, template.judge0_language_id);
    };

    const editCode = (value: string) => {
        setCode(value);
        onChange(value, current.judge0_language_id);
    }


    return {
        templates,
        selectedLanguage,
        code,
        changeLanguage,
        editCode
    }

}