//This file defines a mathfield object that can be imported into the match screens
//Tutorial taken from https://mathlive.io/mathfield/guides/getting-started/

import "mathlive";
import { MathfieldElement} from "mathlive";
import { useState, useRef } from "react";
import VirtualKeyboard from './VirtualKeyboard';

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

const Math = ({ onValueChange }: MathFieldProps) => {
  const [value, setValue] = useState<string>('');
  const mathfieldRef = useRef<MathfieldElement | null>(null)

  const handleInput = (evt: React.SyntheticEvent<MathfieldElement>) => {
    const target = evt.target as MathfieldElement;
    const newValue = target.value;
    setValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <div className="w-[90%] ">
      <math-field
        ref={mathfieldRef}
        onInput={handleInput}
        className="w-[100%] h-[18rem] rounded-4xl"
      >
        {value}
      </math-field>
      <VirtualKeyboard mathfieldRef={mathfieldRef} />
    </div>
  );
};

export default Math;