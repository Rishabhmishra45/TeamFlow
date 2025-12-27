import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const WorkspaceDashboard = () => {
  const { id } = useParams(); // workspaceId
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    const res = await api.get(`/projects/${id}`);
    setProjects(res.data);
  };

  const createProject = async () => {
    if (!name.trim()) return;
    setLoading(true);
    await api.post("/projects", {
      name,
      workspaceId: id,
    });
    setName("");
    setLoading(false);
    fetchProjects();
  };

  useEffect(() => {
    fetchProjects();
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
              <span className="font-bold">P</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Projects
              </h1>
              <p className="text-gray-400 mt-1">
                All projects inside this workspace
              </p>
            </div>
          </div>
        </div>

        {/* Create Project Section */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 mb-10">
          <h2 className="text-lg font-semibold mb-4 text-gray-300">Create New Project</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              className="flex-1 px-4 py-3.5 rounded-xl bg-gray-800/60 border border-gray-700 text-white placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/30 transition-all duration-300"
              placeholder="Enter project name (e.g., 'Marketing Campaign')"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              onClick={createProject}
              disabled={loading}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 
                       text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20
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
              ) : "Create Project"}
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="bg-gray-900/30 rounded-2xl border-2 border-dashed border-gray-800 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📁</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No projects yet</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Create your first project to start organizing tasks and collaborating with your team.
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-300">All Projects ({projects.length})</h2>
              <span className="text-sm text-gray-500">Click to open board</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project._id}
                  onClick={() => navigate(`/board/${project._id}`)}
                  className="group relative bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-800 cursor-pointer
                           hover:border-green-500/50 hover:bg-gray-900/70 transition-all duration-300 hover:-translate-y-1
                           hover:shadow-xl hover:shadow-green-500/5"
                >
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 
                                group-hover:from-green-900/30 group-hover:to-green-900/10 flex items-center justify-center">
                    <span className="text-gray-400 group-hover:text-green-400 transition-colors">→</span>
                  </div>
                  
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/20 to-indigo-700/20 flex items-center justify-center mb-4">
                    <span className="text-xl">📋</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-300 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {project.description || "No description provided"}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-3 py-1 rounded-full bg-gray-800 text-gray-300">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-green-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                      Open Board →
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

export default WorkspaceDashboard;