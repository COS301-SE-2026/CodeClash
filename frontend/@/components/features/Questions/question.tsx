import * as React from "react";
import ReactMarkDown from 'react-markdown';
import remarkGfm from "remark-gfm";
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import "katex/dist/katex.min.css";
import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";
import { MatchCard } from "@/components/features/Match/MatchCard";


interface QuestionProps {
  children?: React.ReactNode,
  difficulty: string,
  title: string,
  description?: string,
  className?: string
}


export const Question = ({
  className,
  children,
  difficulty,
  title,
  description,
}: QuestionProps) => {
  return (
    <div
      className={cn(
        "flex flex-col justify-between text-secondary",
        className,
      )}
    >
      <MatchCard className="flex flex-col p-2 rounded-lg w-full h-[20rem] -mt-5 gap-3">
        <div className="flex justify-between w-full">

          {difficulty.length > 0 && <Badge
            className="w-[7%] h-[1.5rem] text-white text-xs mt-2 mr-2"
            variant={"default"}
          >
            {difficulty}
          </Badge>}
        </div>

        <div className="ml-3 m-5 flex flex-col min-h-0 justify-evenly">
          <h1 className="text-[1.6rem] -mt-8 font-semibold">{title}</h1>
          <div className="text-[1rem] text-muted-text mt-1 min-h-0 flex-1 overflow-y-auto">
            <QuestionDescription
              description={description!}

            />
          </div>
        </div>
      </MatchCard>

      <div className="ml-8 rounded-xl overflow-hidden w-[100%]">
        {children}
      </div>
    </div>
  );
}


const tableRegex = new RegExp(String.raw`\\begin\{tabular\}\{[^]*\}([\s\S]*?)\\end\{tabular\}`, 'g');

const tableToMarkdown = (text: string): string => {
  return text.replace(tableRegex, (_, body: string) => {
    const rows = body.split(`\\\\`)
      .map(row => row.trim())
      .filter(Boolean)
      .map(row => row.split('&').map(cell => cell.trim()));


    if (rows.length === 0) return '';

    const header = rows[0];
    const separator = header.map(() => '----');
    const dataRows = rows.slice(1);

    const toMdRow = (cells: string[]) => `| ${cells.join('|')}`;
    return [toMdRow(header), toMdRow(separator), ...dataRows.map(toMdRow)].join('\n');
  })
}

export const QuestionDescription = ({ description }: { description: string }) => {
  const processed = React.useMemo(() => tableToMarkdown(description), [description]);

  return (
    <div className="prose prose-invert max-w-none pt-[1rem]">
      <ReactMarkDown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
        {processed}
      </ReactMarkDown>
    </div>
  )
}

