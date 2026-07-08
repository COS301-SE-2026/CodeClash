import { cleanup } from '@testing-library/react';
import {afterEach } from 'vitest';
import '@testing-library/jest-dom';

// clean up so tests don't interfere with each other
afterEach(() => {
  cleanup();
});