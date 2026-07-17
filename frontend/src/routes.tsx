import { createBrowserRouter } from "react-router-dom";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Welcome from "./pages/Welcome";

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