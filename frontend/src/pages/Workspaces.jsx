import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Workspaces = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchWorkspaces = async () => {
    const res = await api.get("/workspaces");
    setWorkspaces(res.data);
  };

  const createWorkspace = async () => {
    if (!name.trim()) return;
    setLoading(true);
    await api.post("/workspaces", { name });
    setName("");
    setLoading(false);
    fetchWorkspaces();
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
              <span className="font-bold">W</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Workspaces
              </h1>
              <p className="text-gray-400 mt-1">
                Manage your teams and projects in dedicated workspaces
              </p>
            </div>
          </div>
        </div>

        {/* Create Workspace Section */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 mb-10">
          <h2 className="text-lg font-semibold mb-4 text-gray-300">Create New Workspace</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              className="flex-1 px-4 py-3.5 rounded-xl bg-gray-800/60 border border-gray-700 text-white placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all duration-300"
              placeholder="Enter workspace name (e.g., 'Marketing Team')"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              onClick={createWorkspace}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                       text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20
                       active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : "Create Workspace"}
            </button>
          </div>
        </div>

        {/* Workspaces Grid */}
        {workspaces.length === 0 ? (
          <div className="bg-gray-900/30 rounded-2xl border-2 border-dashed border-gray-800 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏢</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No workspaces yet</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Create your first workspace to organize projects and collaborate with your team members.
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-300">Your Workspaces ({workspaces.length})</h2>
              <span className="text-sm text-gray-500">Click to open workspace</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {workspaces.map((ws) => (
                <div
                  key={ws._id}
                  onClick={() => navigate(`/workspaces/${ws._id}`)}
                  className="group relative bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-800 cursor-pointer
                           hover:border-blue-500/50 hover:bg-gray-900/70 transition-all duration-300 hover:-translate-y-1
                           hover:shadow-xl hover:shadow-blue-500/5"
                >
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 
                                group-hover:from-blue-900/30 group-hover:to-blue-900/10 flex items-center justify-center">
                    <span className="text-gray-400 group-hover:text-blue-400 transition-colors">→</span>
                  </div>
                  
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/20 to-indigo-700/20 flex items-center justify-center mb-4">
                    <span className="text-xl">🏢</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                    {ws.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400 text-sm">👥</span>
                      <span className="text-gray-400 text-sm">
                        {ws.members?.length || 1} member{ws.members?.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-3 py-1 rounded-full bg-gray-800 text-gray-300">
                      {new Date(ws.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-blue-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                      Open Workspace →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Workspaces;