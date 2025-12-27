import { useState } from "react";
import api from "../api/axios";
import ActivityTimeline from "./ActivityTimeline";

const TaskModal = ({ task, onClose, refresh }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority || "medium");
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    await api.patch(`/tasks/${task._id}/details`, {
      title,
      description,
      priority,
    });
    setLoading(false);
    refresh();
    onClose();
  };

  const remove = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmDelete) return;

    await api.delete(`/tasks/${task._id}`);
    refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900/90 backdrop-blur-xl text-white w-full max-w-2xl rounded-2xl border border-gray-800 
                    shadow-2xl shadow-black/50 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Task Details
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-gray-800/50 flex items-center justify-center hover:bg-gray-800 transition-colors"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Edit task information and track activity
          </p>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Task Title
            </label>
            <input
              className="w-full bg-gray-800/60 border border-gray-700 px-4 py-3 rounded-xl text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all duration-300"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              className="w-full bg-gray-800/60 border border-gray-700 px-4 py-3 rounded-xl text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all duration-300"
              rows={4}
              placeholder="Describe the task details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Priority */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Priority
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["low", "medium", "high"].map((level) => (
                <button
                  key={level}
                  onClick={() => setPriority(level)}
                  className={`px-4 py-3 rounded-xl border transition-all duration-300 ${
                    priority === level
                      ? level === "high"
                        ? "border-red-500/50 bg-red-900/20 text-red-300"
                        : level === "medium"
                        ? "border-yellow-500/50 bg-yellow-900/20 text-yellow-300"
                        : "border-green-500/50 bg-green-900/20 text-green-300"
                      : "border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600 hover:text-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="capitalize">{level}</span>
                    {priority === level && <span>✓</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Activity Timeline */}
          <ActivityTimeline taskId={task._id} />
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-800 bg-gray-900/50">
          <div className="flex justify-between items-center">
            <button
              onClick={remove}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-900/30 to-red-900/10 
                       text-red-300 border border-red-800/50 hover:border-red-700 hover:bg-red-900/20
                       transition-all duration-300 active:scale-[0.98]"
            >
              Delete Task
            </button>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-gray-600 
                         hover:bg-gray-800 transition-all duration-300 active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 
                         hover:from-green-700 hover:to-emerald-700 text-white font-semibold
                         transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20
                         active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;