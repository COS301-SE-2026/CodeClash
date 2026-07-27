//This file defines a mathfield object that can be imported into the match screens
//Tutorial taken from https://mathlive.io/mathfield/guides/getting-started/

import { MathfieldElement } from "mathlive";
import React, { useState } from "react";

import VirtualKeyboard from "./VirtualKeyboard";

//Extending JSX to react mathfield as a valid element
declare module "react" {
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
}

const MathMatch = ({ onValueChange, mathfieldRef, className }: MathMatchProps) => {
  const [value, setValue] = useState<string>('');

  const handleInput = (evt: React.SyntheticEvent<MathfieldElement>) => {
    const target = evt.target as MathfieldElement;
    const newValue = target.value;
    setValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <div className="flex items-center w-[90%] h-[100%]">
      <math-field
        ref={mathfieldRef}
        onInput={handleInput}
        className={`${className} w-[100%] h-[12rem] rounded-4xl`}
      >
        {value}
      </math-field>
      <VirtualKeyboard mathfieldRef={mathfieldRef} />
    </div>
  );
};

export default MathMatch;