import { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import UserDashboard from "./pages/UserDashboard";
import FarmerDashboard from "./pages/FarmerDashboard";
import WorkerDashboard from "./pages/WorkerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Workers from "./pages/Workers";
import WorkerDetail from "./pages/WorkerDetail";

import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

class DashboardErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <main className="dashboard-shell container">
          <p className="eyebrow">Dashboard</p>
          <h1>We couldn’t load this page.</h1>
          <p className="dashboard-sub">{this.state.error.message || "Please refresh and sign in again."}</p>
        </main>
      );
    }

    return this.props.children;
  }
}


// This component decides which dashboard
// should be displayed based on the logged-in user's role.
function DashboardRouter() {

  // Get the current logged-in user
  const { user } = useAuth();
  // If user information is not available
  if (!user) return <UserDashboard />;


  // Check the user's role
  switch ((user.role || "user").toLowerCase()) {

    // Normal user
    case "user":
      return <UserDashboard />;

    // Farmer
    case "farmer":
      return <FarmerDashboard />;

    // Worker
    case "worker":
      return <WorkerDashboard />;

    // Admin
    case "admin":
      return <AdminDashboard />;

    // If an unknown role is received
    default:
      return <UserDashboard />;
  }
}


function App() {

  return (
    <BrowserRouter>

      <Routes>

        {/* Home page */}
        <Route
          path="/"
          element={<Home />}
        />


        {/* Login page */}
        <Route
          path="/login"
          element={<Login />}
        />


        {/* Register page */}
        <Route
          path="/register"
          element={<Register />}
        />

        <Route path="/workers" element={<Workers />} />
        <Route path="/workers/:id" element={<WorkerDetail />} />


        {/* Protected dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardErrorBoundary>
                <DashboardRouter />
              </DashboardErrorBoundary>
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}


export default App;
