/* Extends Vitest's expect with @testing-library/jest-dom matchers
        e.g. toBeInTheDocument(), toHaveAttribute(), toBeDisabled(), etc.
    This is because these matchers dont exist in Vitest by defualt, without this file we would get "is not a function" error
*/

import '@testing-library/jest-dom';