import { useEffect, useState } from "react";
import api from "../api/axios";
import StatsCard from "../components/StatsCard";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    api.get("/admin/stats").then((res) => setStats(res.data));
  }, []);

  return (
    <div className="p-8 flex-1">
      <h1 className="text-2xl font-bold mb-6">System Overview</h1>

      <div className="grid grid-cols-4 gap-6">
        <StatsCard title="Users" value={stats.users} />
        <StatsCard title="Workspaces" value={stats.workspaces} />
        <StatsCard title="Projects" value={stats.projects} />
        <StatsCard title="Tasks" value={stats.tasks} />
      </div>
    </div>
  );
};

export default AdminDashboard;
