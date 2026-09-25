//This file defines a mathfield object that can be imported into the match screens
//Tutorial taken from https://mathlive.io/mathfield/guides/getting-started/

import { MathfieldElement } from "mathlive";
import React, { useState } from "react";
import { MatchCard } from "../ui/MatchCard";
import VirtualKeyboard from "./VirtualKeyboard";

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "math-field": {
        ref?: React.RefObject<MathfieldElement | null>;
        value?: string;
        onInput?: (evt: React.SyntheticEvent<MathfieldElement>) => void; //double check SyntheticEvent is the correct function
        children?: React.ReactNode;
        className?: string;
        style?: React.CSSProperties;
      };
    }
  }
}



interface MathMatchProps {
  onValueChange?: (value: string) => void;
  mathfieldRef: React.RefObject<MathfieldElement | null>;
  className?: string
  children?: React.ReactNode
}

const MathMatch = ({ onValueChange, mathfieldRef, className, children }: MathMatchProps) => {
  const [value, setValue] = useState<string>('');

  const handleInput = (evt: React.SyntheticEvent<MathfieldElement>) => {
    const target = evt.target as MathfieldElement;
    const newValue = target.value;
    setValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <MatchCard className="flex flex-col items-center w-[100%] h-[40%] mb-auto rounded-2xl mt-5">
      <math-field
        ref={mathfieldRef}
        onInput={handleInput}
        className={`${className} w-[95%] min-h-[10rem] rounded-2xl bg-[var(--match-box)] border-[2px] border-[var(--button-tournament-secondary)] text-secondary text-sm mb-auto my-auto mx-auto`}
      >
        {value}
      </math-field>
      <VirtualKeyboard mathfieldRef={mathfieldRef} />
      {children}
    </MatchCard>
  );
};

export default MathMatch;