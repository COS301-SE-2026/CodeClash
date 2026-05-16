# CodeClash Frontend

We're using a React + TypeScript frontend built with vite.

## Tech Stacke

## Tech Stack

| Tool             | Purpose                |
|------------------|------------------------|
| React            | UI framework           |
| TypeScript       | Type safety            |
| Vite             | Dev server and bundler |
| React Router DOM | Page routing           |

## Installation

cd frontend
npm install
npm install react-router-dom

## Running the App

npm run dev

## Page URL's

The pages are currently using state-based routing, so they are live at the same URL. Navigation is done through the buttons via 'useState'.

## Navigation Flow

Welcome page
  ├── Sign in  →  SignIn page
  │                 └── ← Back  →  Welcome
  │                 └── Sign up →  SignUp page
  └── Sign up  →  SignUp page
                    └── ← Back  →  Welcome

## Fonts

"Baloo Bhai 2" font is loaded via Goggle Fonts in each of the CSS files. This requires an internet connection when running.

## Notes

Google and Apple OAuth sign-ins are not implemented yet. The buttons are wired to prop callbacks (`onGoogleSignIn`, `onAppleSignIn`) and is ready for future integration.