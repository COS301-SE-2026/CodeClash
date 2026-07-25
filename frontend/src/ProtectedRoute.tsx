import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const auth = true; // THIS NEEDS TO BE CHANGED ONCE WE HAVE LOGIN SETUP
  return auth ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default ProtectedRoute;
