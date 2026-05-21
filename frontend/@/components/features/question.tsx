<<<<<<< HEAD
import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
=======
import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "../ui/badge"
>>>>>>> 8599d94c6a78eb3ea7157076a3cae264f666a608

function Question({
  className,
  size = "default",
  children,
  difficulty,
  title,
  question,
  description,
  number,
  ...props
}: React.ComponentProps<"div"> & {
  size?: "default" | "sm";
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
        "flex flex-col justify-between bg-white rounded-2xl",
        className,
      )}
    >
      {/* bar at the top */}
      <div className="bg-gradient-to-r from-[#0C3883] to-[#D2C4FD] h-5 w-[100%] rounded-2xl shadow-[0_4px_6px_rgba(0,0,0,0.3)]"></div>

      <div className="flex flex-col p-2">
        <div className="flex justify-between w-full">
          <p className="font-bold text-2xl">Question {number}</p>
          <Badge
            className="w-[10%] h-[70%] text-white text-xl"
            variant={"secondary"}
          >
            {difficulty}
          </Badge>
        </div>

        <div className="m-5 flex flex-col justify-evenly">
          <h1 className="text-5xl font-semibold"> &lt; / &gt; {title}</h1>
          <p className="text-xl text-muted-text m-1">{question}</p>

          <div className="whitespace-pre-wrap">{description}</div>
        </div>
      </div>

      <div className="ml-8 mb-2 rounded-xl overflow-hidden w-[100%]">
        {children}
      </div>
    </div>
  );
}

export { Question };
