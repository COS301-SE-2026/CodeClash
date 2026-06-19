# CodeClash Frontend

We're using a React + TypeScript frontend built with Vite.

## Tech Stack

| Tool             | Purpose                |
|------------------|------------------------|
| React            | UI framework           |
| TypeScript       | Type safety            |
| Vite             | Dev server and bundler |
| React Router DOM | Page routing           |

## Installation

- cd frontend
- For the pages: 
    - npm install
    - npm install react-router-dom
    - npm install -D @tailwindcss/vite tailwindcss
- For component testing:
    - npm install -D vitest @vitest/coverage-v8 @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

## Running

from the root

### The App

````
npm run frontend   // to run the frontend only
npm run backend    // to run the backend only 
npm run dev        // to run both frontend and backend
````

### Testing 

Frontend
````
npm run test:frontend               //test only
npm run test:frontend:coverage      //test and coverage


To run tests on an individual file 

````
npx vitest run test/unit/<FileName.test.tsx>
````

## Page URL's

The pages are currently using state-based routing, so they are live at the same URL. Navigation is done through the buttons via 'useState'.

## Navigation Flow

![Diagram](../docs/UserFlow_Diagram.png)

## Fonts

"Baloo Bhai 2" font is loaded via Google Fonts in each of the CSS files. This requires an internet connection when running.

## Notes

Google and Apple OAuth sign-ins are not implemented yet. The buttons are wired to prop callbacks (`onGoogleSignIn`, `onAppleSignIn`) and is ready for future integration.
