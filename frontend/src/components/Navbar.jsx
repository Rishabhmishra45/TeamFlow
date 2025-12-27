import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left Side - Logo & Navigation */}
        <div className="flex items-center gap-8">
          <Link to="/workspaces" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
              <span className="text-white font-bold">T</span>
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              TeamFlow
            </h1>
          </Link>
          
          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/workspaces" 
              className="text-sm text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-gray-800/50"
            >
              Workspaces
            </Link>
            <span className="text-xs text-gray-500">|</span>
            <span className="text-sm text-gray-500">v2.0</span>
          </div>
        </div>

        {/* Right Side - User Info & Actions */}
        <div className="flex items-center gap-4">
          {user && (
            <>
              {/* Notifications */}
              <div className="hidden sm:block">
                <NotificationBell />
              </div>
              
              {/* User Profile */}
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl bg-gray-800/50 border border-gray-700">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600/20 to-indigo-700/20 flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-300">{user.name?.charAt(0) || 'U'}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-200">{user.name || 'User'}</p>
                  <p className="text-xs text-gray-400 capitalize">{user.role || 'member'}</p>
                </div>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={logout}
                className="px-4 py-2.5 text-sm font-medium bg-gradient-to-r from-red-600 to-pink-600 
                         hover:from-red-700 hover:to-pink-700 text-white rounded-xl transition-all duration-300
                         hover:shadow-lg hover:shadow-red-500/20 active:scale-[0.98]"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;