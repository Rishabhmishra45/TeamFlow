import { useEffect, useState } from "react";
import api from "../api/axios";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/admin/projects");
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
    const interval = setInterval(fetchProjects, 5000); // 🔁 REAL TIME

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex-1 text-white">
        Loading projects...
      </div>
    );
  }

  return (
    <div className="p-8 flex-1 text-white">
      <h1 className="text-2xl font-bold mb-6">Projects</h1>

      {projects.length === 0 ? (
        <p className="text-gray-400">No projects found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-gray-800 p-6 rounded-2xl border border-gray-700"
            >
              <h3 className="text-lg font-semibold">
                {project.name}
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Workspace: {project.workspace?.name || "N/A"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
