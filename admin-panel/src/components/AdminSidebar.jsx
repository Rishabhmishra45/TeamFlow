import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="w-64 bg-gray-800 p-6">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="space-y-3">
        <Link to="/" className="block hover:text-blue-400">
          Dashboard
        </Link>
        <Link to="/users" className="block hover:text-blue-400">
          Users
        </Link>
        <Link to="/workspaces" className="block hover:text-blue-400">
          Workspaces
        </Link>
        <Link to="/projects" className="block hover:text-blue-400">
          Projects
        </Link>
      </nav>
    </div>
  );
};

export default AdminSidebar;
