import MathField from './components/MathField.tsx'; 
import { useState } from 'react';

const MathFieldTest = () => {
  const [currentValue, setCurrentValue] = useState<string>('');

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>MathField Test Page</h1>
      
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

export default MathFieldTest;