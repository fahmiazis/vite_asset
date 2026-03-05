import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const accessToken = Cookies.get("access_token");

  if (accessToken) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;