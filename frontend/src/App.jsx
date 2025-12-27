import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./utils/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Workspaces from "./pages/Workspaces";
import WorkspaceDashboard from "./pages/WorkspaceDashboard";
import Board from "./pages/Board";
import Navbar from "./components/Navbar";
import NotificationBell from "./components/NotificationBell";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes - No Navbar */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes Layout - With Navbar */}
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            {/* Default Redirect */}
            <Route index element={<Navigate to="/workspaces" />} />
            
            {/* Workspaces */}
            <Route path="/workspaces" element={<Workspaces />} />

            {/* Workspace → Projects */}
            <Route path="/workspaces/:id" element={<WorkspaceDashboard />} />

            {/* Project → Kanban Board */}
            <Route path="/board/:projectId" element={<Board />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

// Main Layout Component with Navbar for all protected routes
const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <Navbar />
      <div className="pt-16"> {/* Add padding to account for fixed navbar */}
        <Routes>
          <Route index element={<Navigate to="/workspaces" />} />
          <Route path="/workspaces" element={<Workspaces />} />
          <Route path="/workspaces/:id" element={<WorkspaceDashboard />} />
          <Route path="/board/:projectId" element={<Board />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;