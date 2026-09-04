<<<<<<< HEAD
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

=======
//Page containing the virtual math keyboard

import { Keyboard } from 'lucide-react';
import { MathfieldElement } from 'mathlive';
import { useEffect, useState } from 'react';

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

>>>>>>> 5378a30cd86c953bdc20aa94765d31b947e8a4e4
export default VirtualKeyboard;