import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Welcome from "./pages/Welcome";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ProgMatch from "./pages/ProgMatch";


const ProtectedRoute = () => {
    const auth = true;     // THIS NEEDS TO BE CHANGED ONCE WE HAVE LOGIN SETUP

    // if not authenticated navigate to sign in
    return auth ? <Outlet /> : <Navigate to='/sign-in' />
}

let router = createBrowserRouter([
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
    {   // routes that need users to be logged in for access
        element: <ProtectedRoute />,
        children: [
            {
                path: '/prog-match',
                Component: ProgMatch
            }
        ]

    }
])

export { router }