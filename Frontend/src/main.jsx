// Import React
import React from "react";

// Import React DOM
import ReactDOM from "react-dom/client";

// Import the main App component
import App from "./App.jsx";

// Import global CSS
import "./index.css";

// Import authentication provider
import { AuthProvider } from "./context/AuthContext.jsx";


// Render the React application
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

    {/* Make authentication available to the entire application */}
    <AuthProvider>

      <App />

    </AuthProvider>

  </React.StrictMode>
);