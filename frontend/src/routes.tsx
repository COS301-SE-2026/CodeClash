import { createBrowserRouter } from "react-router-dom";

import Welcome from "./pages/Welcome";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

const router = createBrowserRouter([
    {
        path: '/',
        Component: Welcome,
    },
    {
        path: '/sign-in',
        Component: SignIn
    },
    {
        path: '/sign-up',
        Component: SignUp
    },
])

export { router }