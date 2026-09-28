import * as React from "react";
import ReactMarkDown from 'react-markdown';
import remarkGfm from "remark-gfm";
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


export const QuestionDescription = ({ description }: { description: string }) => {
  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkDown remarkPlugins={[remarkGfm]}>
        {description}
      </ReactMarkDown>
    </div>
  )
}

