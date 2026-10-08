import * as React from "react";
import ReactMarkDown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
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
export function Question({
  className,
  children,
  difficulty,
  title,
  description,
}: QuestionProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between text-secondary",
        className,
      )}
    >
      <MatchCard className="flex flex-col p-2 rounded-lg w-full h-full min-h-0 -mt-5 gap-3">
        <div className="flex justify-between w-full">

          {difficulty.length > 0 && <Badge
            className="w-[7%] h-[1.5rem] text-primary-text text-xs mt-2 mr-2"
            variant={"default"}
          >
            {difficulty}
          </Badge>}
        </div>

        <div className="ml-3 m-5 flex flex-col justify-evenly min-h-0 flex-1">
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

// so, because math questions are fetched in Latex, latex only works between $$...$$ or $...$ tags, so regex is added so that math segments are rendered correctly
const MATH_SEGMENT = /(\$\$[\s\S]*?\$\$|\$(?:\\\$|[^$])*?\$)/;

const tableCell = (cell: string) => {
  const text = cell.trim();
  if (text.includes('$')) return text.replace(/\$/g, '');
  return /[a-zA-Z]/.test(text) && !text.startsWith('\\') ? `\\text{${text}}` : text;
}; // same thing, regex added so that table cells are properly rendered as well

const toMarkdownMath = (text: string) => text
  // markdown also uses \[ \] to escape brackets (SGF[4]), therefore it'll only treat it as math if it conatins it
  .replace(/\\\[([\s\S]*?)\\\]/g, (match, body: string) => /\\|=|\^/.test(body) ? `$$${body}$$` : match)
  .replace(/\\begin\{tabular\}\{([^}]*)\}([\s\S]*?)\\end\{tabular\}/g, (_, cols, body: string) =>
    `$$\\begin{array}{${cols}}${body.split('\\\\').map(row => row.split('&').map(tableCell).join(' & ')).join(' \\\\ ')}\\end{array}$$`)
  .split(MATH_SEGMENT)
  .map((part, i) => {
    if (i % 2 === 0) return part.replace(/\\begin\{align\*?\}([\s\S]*?)\\end\{align\*?\}/g, (_, body) => `\n\n$$\n\\begin{aligned}${body}\\end{aligned}\n$$\n\n`);
    // an escaped dollar ($\$5$) would end the maths early, so use KaTeX's own dollar sign
    const maths = part.replace(/\\\$/g, '\\text{\\textdollar}');
    // $$...$$ only renders as a block when it sits on its own lines
    return maths.startsWith('$$') ? `\n\n$$\n${maths.slice(2, -2).trim()}\n$$\n\n` : maths;
  })
  .join(''); // i wont even act like i understand this regex, but basically as said above, latex requires the $ to be rendered properly, so this is just making sure that the markdown that it reseives is properly translated in the math sections


export const QuestionDescription = ({ description }: { description: string }) => {

  return (
    <div className="prose prose-invert max-w-none pt-[1rem] [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_code]:break-words">
      <ReactMarkDown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
        {toMarkdownMath(description ?? '')}
      </ReactMarkDown>
    </div>
  )
}