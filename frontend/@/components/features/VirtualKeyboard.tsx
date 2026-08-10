//Page containing the virtual math keyboard

import { MathfieldElement } from 'mathlive';
import { useEffect, useState } from 'react';
import { Keyboard } from 'lucide-react';

interface VirtualKeyboardProps {
  mathfieldRef: React.RefObject<MathfieldElement | null>;
}

const VirtualKeyboard = ({ mathfieldRef }: VirtualKeyboardProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const mf = mathfieldRef.current;

    if (!mf) return;

    // Set keyboard policy to manual so we control when it shows
    mf.mathVirtualKeyboardPolicy = 'manual';

    // Tell MathLive to attach the keyboard to a specific container
    window.mathVirtualKeyboard.container = document.body;

    const handleChange = () => {
      setOpen(window.mathVirtualKeyboard.visible);
    };

    window.mathVirtualKeyboard.addEventListener(
      'virtual-keyboard-change',
      handleChange
    );

    // Cleanup event listeners when component unmounts
    return () => {

      window.mathVirtualKeyboard.removeEventListener(
        'virtual-keyboard-change',
        handleChange
      )
    };
  }, [mathfieldRef]);

  return null
};

export default VirtualKeyboard;