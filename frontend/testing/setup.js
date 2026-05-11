import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// clean up so tests don't interfere with each other
afterEach(() => {
  cleanup();
});