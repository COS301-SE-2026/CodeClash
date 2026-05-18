//Page containing the virtual math keyboard

import 'mathlive';
import { MathfieldElement } from 'mathlive';
import { useEffect, useRef } from 'react';

interface VirtualKeyboardProps {
  mathfieldRef: React.RefObject<MathfieldElement | null>;
}

const VirtualKeyboard = ({ mathfieldRef }: VirtualKeyboardProps) => {
  useEffect(() => {
    const mf = mathfieldRef.current;

    if (!mf) return;

    // Set keyboard policy to manual so we control when it shows
    mf.mathVirtualKeyboardPolicy = 'manual';

    const handleFocusIn = () => {
      window.mathVirtualKeyboard.show();
    };

    const handleFocusOut = () => {
      window.mathVirtualKeyboard.hide();
    };

    mf.addEventListener('focusin', handleFocusIn);
    mf.addEventListener('focusout', handleFocusOut);

    // Cleanup event listeners when component unmounts
    return () => {
      mf.removeEventListener('focusin', handleFocusIn);
      mf.removeEventListener('focusout', handleFocusOut);
    };
  }, [mathfieldRef]);

  return null;
};

export default VirtualKeyboard;