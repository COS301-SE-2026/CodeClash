# CodeClash Frontend

The CodeClash frontend is built using **React**, **TYpeScript**, and **Vite**, following the **MVVM(Model-View-ViewModel)** architecture. It provides a responsive interface for users to compete in live programming and mathematics battles, track their progress, and access supporting documentation.

---

## Tech Stack

| Tool             | Purpose                |
|------------------|------------------------|
| React            | UI framework           |
| TypeScript       | Type safety            |
| Vite             | Development server and bundler |
| React Router DOM | Page routing           |
| Tailwind CSS | Styling |
| Lucide React | Icons |
| Vitest | Unit Testing |
| Testing Library | Component Testing |

---

## Installation

Navigate to the frontend directory.

```bash
cd frontend
```

Install dependencies.

```bash
npm install
```

If necessary, install the core packages manually.

```bash
npm install react-router-dom
npm install lucide-react
npm install tailwindcss @tailwindcss/vite
npm install socket.io-client
```

Testing packages.

```bash
npm install -D vitest @vitest/coverage-v8 @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

---

## Running

from the root

### The App

From the root:

```bash
npm run frontend   
```

```bash
npm run backend    
```

```bash
npm run dev       
```

---

### Testing 

Frontend:
```bash
npm run test:frontend       
```

Coverage: 
```bash
npm run test:frontend:coverage      
```

To run tests on an individual file:
```bash
npx vitest run <path-to-test-file>
```
---

## Architecture

The project follows the **MVVM (Model-View-ViewModel)** architecture.

- **Models** contain page content, interfaces, and data structures.
- **Views** render the UI.
- **ViewModels** contain presentation logic and page behaviour.

---

## Routing

Navigation is handled using **React Router DOM**

### Public Routes

- Landing
- Sign In
- Sign Up
- Terms & Conditions
- Brand Style Guide
- Help Menu
- Game Guide

Unauthenticated users attempting to access non public routes are redeirected to the Sign in page.

## Navigation Flow

![Diagram](../docs/UserFlow_Diagram.png)

---

## Features

The frontend currently includes: 

- Responsive landing page
- Authentication pages
- Terms & Conditions
- Dashboard
- Responsive sidebar navigation
- Live match interface
- Match history 
- Leaderboards
- Help Menu
- Game Guide
- Brand Style Guide
- MVVM architecture

---

## Styling

The project uses: 

- Tailwind CSS 
- Custom CSS variables
- Responsive layouts
- Design tokens
- Lucide react icons
- Google fonts

Primary fonts:

- Roboto
- Baloo Bhai 2

---

## Websockets

Install:

```bash
npm install socket.io-client
```

Ensure the correct env variables are configured.

Run the frontend from the root: 

```bash
npm run frontend   
```

---

# Authors

Developed by QuantDevs:

- Taskeen Abdoola
- Morgan Calaca
- Swelihle Makhathini 
- Ntuthuko Mbatha 
- Nosandiso Mzoneli 