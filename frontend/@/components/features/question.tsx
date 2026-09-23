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
      <MatchCard className="flex flex-col p-2 rounded-lg w-[90%]">
        <div className="flex justify-between w-full">
          <p className="ml-3 font-bold text-md">Question {number}</p>
          <Badge
            className="w-[10%] h-[2rem] text-white text-sm mt-2 mr-2"
            variant={"default"}
          >
            {difficulty}
          </Badge>
        </div>

        <div className="m-5 flex flex-col justify-evenly">
          <h1 className="text-[2rem] -mt-8 font-semibold">{title}</h1>
          <div className="text-sm text-muted-text">{description?.replaceAll(String.raw`\n`, '\n')}</div>
        </div>
      </MatchCard>

      <div className="ml-8 rounded-xl overflow-hidden w-[100%]">
        {children}
      </div>
    </div>
  );
}

export { Question };
