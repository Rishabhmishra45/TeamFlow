import { useEffect, useState } from "react";
import api from "../api/axios";

const Workspaces = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const res = await api.get("/admin/workspaces");
        setWorkspaces(res.data);
      } catch (err) {
        console.error("Failed to fetch workspaces");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
    const interval = setInterval(fetchWorkspaces, 5000); // 🔁 REAL TIME

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex-1 text-white">
        Loading workspaces...
      </div>
    );
  }

  return (
    <div className="p-8 flex-1 text-white">
      <h1 className="text-2xl font-bold mb-6">Workspaces</h1>

      {workspaces.length === 0 ? (
        <p className="text-gray-400">No workspaces found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workspaces.map((ws) => (
            <div
              key={ws._id}
              className="bg-gray-800 p-6 rounded-2xl border border-gray-700"
            >
              <h3 className="text-lg font-semibold">{ws.name}</h3>
              <p className="text-sm text-gray-400 mt-1">
                Owner: {ws.owner?.name || "N/A"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Workspaces;
