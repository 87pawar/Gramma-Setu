// Import Navigate for redirecting users
import { Navigate } from "react-router-dom";

// Import authentication hook
import { useAuth } from "../context/AuthContext";


// Protected route component
function ProtectedRoute({ children }) {

  // Get authentication status
  const { isAuthenticated } = useAuth();


  // If user is not logged in, redirect to Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }


  // If user is logged in, show the requested page
  return children;
}


export default ProtectedRoute;