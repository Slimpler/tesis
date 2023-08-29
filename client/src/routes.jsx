import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/authContext";

export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  console.log({
    isAuthenticated,
    loading,
  });

  if (loading) return <h1>Loading...</h1>;
  else if (!isAuthenticated && !loading) return <Navigate to="/" replace />;
  return <Outlet />;
};

export const ProtectedRouteAdmin = () => {
  const { user, loading, isAuthenticated } = useAuth();
  // console.log('admin')

  if (loading) return <h1>Loading...</h1>;
  if (!isAuthenticated && !loading) return <Navigate to="/" replace />; 

  if (user.roles.includes("admin")) {
    return <Outlet />;
  }

  return <Navigate to="/" replace />;
};
export const ProtectedRoutePaciente = () => {
  const { user, loading, isAuthenticated } = useAuth();
  // console.log('paciente')

  if (loading) return <h1>Loading...</h1>;
  if (!isAuthenticated && !loading) return <Navigate to="/" replace />;

  if (user.roles.includes("paciente")) {
    return <Outlet />;
  }
  
  return <Navigate to="/" replace />;
};

export const ProtectedRouteModerator = () => {
  const { user, loading, isAuthenticated } = useAuth();
  // console.log('moderator')

  if (loading) return <h1>Loading...</h1>;
  if (!isAuthenticated && !loading) return <Navigate to="/" replace />;

  if (user.roles.includes("moderator")||user.roles.includes("admin")) {
    return <Outlet />;
  }

  return <Navigate to="/" replace />;
};
