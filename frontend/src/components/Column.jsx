import TaskCard from "./TaskCard";
import { useState } from "react";
import api from "../api/axios";

const Column = ({ column, tasks, refresh }) => {
  const [title, setTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const createTask = async () => {
    if (!title.trim()) return;
    
    setIsAdding(true);
    await api.post("/tasks", {
      title,
      projectId: column.project,
      columnId: column._id,
      order: tasks.length,
    });

    setTitle("");
    setIsAdding(false);
    refresh();
  };

  const onDrop = async (e) => {
    const taskId = e.dataTransfer.getData("taskId");

    await api.patch(`/tasks/${taskId}`, {
      columnId: column._id,
      order: tasks.length,
    });

    refresh();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isAdding) {
      createTask();
    }
    if (e.key === 'Escape') {
      setTitle("");
      setIsAdding(false);
    }
  };

  return (
    <div
      className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-5 w-80 flex-shrink-0
                hover:border-blue-500/30 transition-all duration-200"
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      {/* Column Header */}
      <div className="mb-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-200 px-3 py-1.5 rounded-lg bg-gray-800/50">
            {column.name} ({tasks.length})
          </h2>
          <span className="text-xs text-gray-500">Drag & drop</span>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3 mb-4 min-h-[100px]">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>

      {/* Add Task Input */}
      <div className="mt-6">
        <input
          className="w-full bg-gray-800/60 border border-gray-700 px-4 py-3 rounded-xl text-sm text-white
                   focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30
                   transition-all duration-300 placeholder-gray-500"
          placeholder="New task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsAdding(true)}
        />
        {(title.trim() || isAdding) && (
          <div className="flex gap-2 mt-3">
            <button
              onClick={createTask}
              disabled={!title.trim() || isAdding}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                       text-white font-medium text-sm py-2.5 rounded-xl transition-all duration-300 
                       hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isAdding ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </span>
              ) : "Add Task"}
            </button>
            <button
              onClick={() => {
                setTitle("");
                setIsAdding(false);
              }}
              className="px-4 py-2.5 text-sm text-gray-400 hover:text-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Column;