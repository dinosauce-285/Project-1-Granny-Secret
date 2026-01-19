import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const user = localStorage.getItem("user");
  const location = useLocation();

  if (!user) {
    return <Navigate to="/landing-page" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
