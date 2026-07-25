import MathField from '../../@/components/features/MathPage.tsx';
import { useState } from 'react';
import { Link } from 'react-router-dom';
=======
import { Link } from 'react-router-dom';

import MathField from '../../@/components/features/MathField.tsx';
>>>>>>> 1a91153d0bfc103692795b99232322c777702128

const MathMatch= () => {
  const [currentValue, setCurrentValue] = useState<string>('');

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>MathField Test Page</h1>
      <Link to='/dashboard'>Back</Link>
      <h2>Math Input:</h2>
      <MathField onValueChange={(val) => setCurrentValue(val)} />

      <h2>Current Value (LaTeX):</h2>
      <pre style={{
        background: '#f4f4f4',
        padding: '1rem',
        borderRadius: '8px'
      }}>
        {currentValue || 'Nothing typed yet'}
      </pre>
    </div>
  );
};

export default MathMatch;