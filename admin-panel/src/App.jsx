import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import Users from "./pages/Users";
import Workspaces from "./pages/Workspaces";
import Projects from "./pages/Projects";
import AdminSidebar from "./components/AdminSidebar";

const App = () => {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-900 text-white">
        <AdminSidebar />
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/workspaces" element={<Workspaces />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
