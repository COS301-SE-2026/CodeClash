import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Welcome from "./Views/Welcome";
import SignIn from "./Views/SignIn";
import SignUp from "./Views/SignUp";
import ProgMatch from "./pages/ProgMatch";

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