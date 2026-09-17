// Import React hooks
import {
  createContext,
  useContext,
  useState,
} from "react";

// Import JWT helper
import { getUserFromToken } from "../utils/auth";

// Create authentication context
const AuthContext = createContext();


// Authentication Provider
export function AuthProvider({ children }) {

  // Get existing token from localStorage
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  // Get user information from the token
  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem("token");

    return getUserFromToken(savedToken);
  });


  // Login function
  function login(newToken, loggedInUser = null) {

    // Save JWT token
    localStorage.setItem("token", newToken);

    // Update token state
    setToken(newToken);

    // Extract user information from JWT
    const userData = loggedInUser || getUserFromToken(newToken);

    // Store user information in React state
    setUser(userData);
  }


  // Logout function
  function logout() {

    // Remove JWT token
    localStorage.removeItem("token");

    // Clear token state
    setToken(null);

    // Clear user information
    setUser(null);
  }


  // Check authentication status
  const isAuthenticated = !!token;


  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


// Custom authentication hook
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
