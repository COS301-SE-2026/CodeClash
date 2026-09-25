import * as React from "react";

import { Badge } from "../ui/badge";

import { cn } from "@/lib/utils";
import { MatchCard } from "../ui/MatchCard";

function Question({
  className,
  children,
  difficulty,
  title,
  description,
  number
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode;
  difficulty: string;
  title: string;
  description?: string;
  number: number;
}) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between text-secondary",
        className,
      )}
    >
      <MatchCard className="flex flex-col p-2 rounded-lg w-full h-auto -mt-5 gap-3">
        <div className="flex justify-between w-full">
          <p className="ml-3 mt-2 font-bold text-[1rem]">Question {number}</p>
          <Badge
            className="w-[7%] h-[1.5rem] text-white text-xs mt-2 mr-2"
            variant={"default"}
          >
            {difficulty}
          </Badge>
        </div>

        <div className="ml-3 m-5 flex flex-col justify-evenly">
          <h1 className="text-[1.6rem] -mt-8 font-semibold">{title}</h1>
          <div className="text-[1rem] text-muted-text mt-1">{description?.replaceAll(String.raw`\n`, '\n')}</div>
        </div>
      </MatchCard>

      <div className="ml-8 rounded-xl overflow-hidden w-[100%]">
        {children}
      </div>
    </div>
  );
}

export { Question };
