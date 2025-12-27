import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import TaskModal from "../components/TaskModal";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const Board = () => {
  const { projectId } = useParams();

  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [activeTask, setActiveTask] = useState(null);

  if (!projectId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white p-10 flex items-center justify-center">
        <div className="text-center bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800">
          <div className="w-16 h-16 rounded-full bg-red-900/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold mb-2">Invalid Project</h2>
          <p className="text-gray-400">Please open the board from a project page.</p>
        </div>
      </div>
    );
  }

  const fetchBoard = async () => {
    const colRes = await api.get(`/columns/${projectId}`);
    const taskRes = await api.get(`/tasks/${projectId}`);
    setColumns(colRes.data);
    setTasks(taskRes.data);
  };

  useEffect(() => {
    fetchBoard();
  }, [projectId]);

  const addColumn = async () => {
    await api.post("/columns", {
      title: "New Column",
      projectId,
    });
    fetchBoard();
  };

  const addTask = async (columnId) => {
    if (!taskTitle.trim()) return;
    await api.post("/tasks", {
      title: taskTitle,
      columnId,
      projectId,
    });
    setTaskTitle("");
    fetchBoard();
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    await api.patch(`/tasks/${result.draggableId}`, {
      columnId: result.destination.droppableId,
    });

    fetchBoard();
  };

  const priorityColor = (priority) => {
    if (priority === "high") return "bg-gradient-to-r from-red-600 to-pink-600";
    if (priority === "medium") return "bg-gradient-to-r from-yellow-600 to-amber-600";
    return "bg-gradient-to-r from-green-600 to-emerald-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white p-6">
      <div className="max-w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Kanban Board
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Drag and drop tasks between columns
            </p>
          </div>
          <button
            onClick={addColumn}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                     text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 
                     hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98]"
          >
            + Add Column
          </button>
        </div>

        {/* Board Columns */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {columns.map((col) => (
              <Droppable droppableId={col._id} key={col._id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`bg-gray-900/50 backdrop-blur-sm p-5 rounded-2xl border border-gray-800 w-80 flex-shrink-0
                              ${snapshot.isDraggingOver ? 'border-blue-500/50 bg-blue-900/10' : ''}
                              transition-all duration-200`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-semibold text-gray-200 px-3 py-1 rounded-lg bg-gray-800/50">
                        {col.title} ({tasks.filter((t) => t.column === col._id).length})
                      </h2>
                    </div>

                    <div className="space-y-3 min-h-[200px]">
                      {tasks
                        .filter((t) => t.column === col._id)
                        .map((task, index) => (
                          <Draggable
                            key={task._id}
                            draggableId={task._id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() => setActiveTask(task)}
                                className={`bg-gray-800/70 backdrop-blur-sm p-4 rounded-xl cursor-pointer border border-gray-700
                                          hover:border-blue-500/50 hover:bg-gray-800/90 transition-all duration-200
                                          ${snapshot.isDragging ? 'rotate-2 shadow-xl shadow-blue-500/10' : ''}`}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <span className="font-medium text-gray-100">{task.title}</span>
                                  <span
                                    className={`text-xs font-medium px-3 py-1 rounded-full text-white ${priorityColor(
                                      task.priority
                                    )}`}
                                  >
                                    {task.priority}
                                  </span>
                                </div>
                                {task.description && (
                                  <p className="text-sm text-gray-400 line-clamp-2">
                                    {task.description}
                                  </p>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>

                    {/* Add Task Input */}
                    <div className="mt-4">
                      <input
                        className="w-full bg-gray-800/60 border border-gray-700 px-4 py-3 rounded-xl text-sm
                                 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30
                                 transition-all duration-300 placeholder-gray-500"
                        placeholder="Add task & press Enter"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && addTask(col._id)
                        }
                      />
                      <p className="text-xs text-gray-500 mt-2 px-1">
                        Press Enter to add
                      </p>
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>

        {columns.length === 0 && (
          <div className="text-center py-16 bg-gray-900/30 rounded-2xl border-2 border-dashed border-gray-800">
            <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No columns yet</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Create your first column to start organizing tasks.
            </p>
            <button
              onClick={addColumn}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                       text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 
                       hover:shadow-lg hover:shadow-blue-500/20"
            >
              + Create First Column
            </button>
          </div>
        )}
      </div>

      {activeTask && (
        <TaskModal
          task={activeTask}
          onClose={() => setActiveTask(null)}
          refresh={fetchBoard}
        />
      )}
    </div>
  );
};

export default Board;