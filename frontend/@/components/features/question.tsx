import * as React from "react";

import { Badge } from "../ui/badge";

import { cn } from "@/lib/utils";

function Question({
  className,
  children,
  difficulty,
  title,
  question,
  description,
  number
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode;
  difficulty: string;
  title: string;
  question: string;
  description?: string;
  number: number;
}) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between text-primary",
        className,
      )}
    >
      <div className="flex flex-col p-2">
        <div className="flex justify-between w-full">
          <p className="font-bold text-md">Question {number}</p>
          <Badge
            className="w-[10%] h-[2rem] text-white text-sm"
            variant={"default"}
          >
            {difficulty}
          </Badge>
        </div>

        <div className="m-5 flex flex-col justify-evenly">
          <h1 className="text-5xl font-semibold">{title}</h1>
          <p className="text-sm font-semibold mt-[1%]">{question}</p>

          <div>{description}</div>
        </div>
      </div>

      <div className="ml-8 mb-2 rounded-xl overflow-hidden w-[100%]">
        {children}
      </div>
    </div>
  );
}

export { Question };
