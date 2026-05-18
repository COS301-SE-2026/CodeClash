# CodeClash Frontend

We're using a React + TypeScript frontend built with vite.

## Tech Stack

| Tool             | Purpose                |
|------------------|------------------------|
| React            | UI framework           |
| TypeScript       | Type safety            |
| Vite             | Dev server and bundler |
| React Router DOM | Page routing           |

## Installation

- cd frontend
- npm install
- npm install react-router-dom
- npm install -D tailwindcss postcss autoprefixer 
- npx tailwindcss init -p //double check this - throwing error

## Running the App

npm run dev

## Page URL's

The pages are currently using state-based routing, so they are live at the same URL. Navigation is done through the buttons via 'useState'.

## Navigation Flow

![Diagram](../docs/UserFlow_Diagram.png)

## Fonts

"Baloo Bhai 2" font is loaded via Google Fonts in each of the CSS files. This requires an internet connection when running.

## Notes

Google and Apple OAuth sign-ins are not implemented yet. The buttons are wired to prop callbacks (`onGoogleSignIn`, `onAppleSignIn`) and is ready for future integration.