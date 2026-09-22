//This file defines a mathfield object that can be imported into the match screens
//Tutorial taken from https://mathlive.io/mathfield/guides/getting-started/

import { MathfieldElement } from "mathlive";
import React from "react";

import VirtualKeyboard from "../VirtualKeyboard";

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


interface MathInputProps {
  value: string,
  onChange: (value: string) => void,
  mathfieldRef: React.RefObject<MathfieldElement | null>,
  className?: string
}

const MathInput = ({ value, onChange, mathfieldRef, className }: MathInputProps) => {

  const handleInput = (evt: React.SyntheticEvent<MathfieldElement>) => {
    const target = evt.target as MathfieldElement;
    onChange(target.value);
  };

  return (
    <div className="flex items-center w-[90%] h-[100%]">
      <math-field
        ref={mathfieldRef}
        onInput={handleInput}
        className={`${className} w-[100%] h-[12rem] rounded-4xl`}
        value={value}
      />
      <VirtualKeyboard mathfieldRef={mathfieldRef} />
    </div>
  );
};

export default MathInput;