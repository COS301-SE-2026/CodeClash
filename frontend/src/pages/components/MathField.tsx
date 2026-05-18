//This file defines a mathfield object that can be imported into the match screens
//Tutorial taken from https://mathlive.io/mathfield/guides/getting-started/

import "mathlive";
import { MathfieldElement} from "mathlive";
import { useState, useRef } from "react";

//Extending JSX to react mathfield as a valid element
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'math-field': {
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


interface MathFieldProps {
  onValueChange?: (value: string) => void;
}

const MathField = ({ onValueChange }: MathFieldProps) => {
  const [value, setValue] = useState<string>('');
  const mathfieldRef = useRef<MathfieldElement | null>(null)

  const handleInput = (evt: React.SyntheticEvent<MathfieldElement>) => {
    const target = evt.target as MathfieldElement;
    const newValue = target.value;
    setValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <div className="mathfield-container">
      <math-field
        ref={mathfieldRef}
        onInput={handleInput}
      >
        {value}
      </math-field>
    </div>
  );
};

export default MathField;