import { useEffect, useState } from "react";
import api from "../api/axios";

const ActivityTimeline = ({ taskId }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get(`/activity/${taskId}`).then((res) => {
      setLogs(res.data);
    });
  }, [taskId]);

  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold mb-2 text-gray-300">
        Activity
      </h3>

      {logs.map((log) => (
        <div
          key={log._id}
          className="text-xs text-gray-400 mb-1"
        >
          <span className="text-white">
            {log.user.name}
          </span>{" "}
          — {log.action}
        </div>
      ))}
    </div>
  );
};

export default ActivityTimeline;
