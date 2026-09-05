//Page containing the virtual math keyboard

import { MathfieldElement } from 'mathlive';
import { useEffect} from 'react';

interface VirtualKeyboardProps {
  mathfieldRef: React.RefObject<MathfieldElement | null>;
}

const VirtualKeyboard = ({ mathfieldRef }: VirtualKeyboardProps) => {

  useEffect(() => {
    const mf = mathfieldRef.current;
    if (!mf) return;

    // Set keyboard policy to manual so we control when it shows
    mf.mathVirtualKeyboardPolicy = 'manual';

    // Tell MathLive to attach the keyboard to a specific container
    window.mathVirtualKeyboard.container = document.body;

  }, [mathfieldRef]);

  return null
};

export default VirtualKeyboard;