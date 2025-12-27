const TaskCard = ({ task }) => {
  const onDragStart = (e) => {
    e.dataTransfer.setData("taskId", task._id);
  };

  const priorityColor = (priority) => {
    if (priority === "high") return "bg-red-500/20 text-red-300";
    if (priority === "medium") return "bg-yellow-500/20 text-yellow-300";
    return "bg-green-500/20 text-green-300";
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="group bg-gray-800/70 backdrop-blur-sm p-4 rounded-xl cursor-move border border-gray-700
                hover:border-blue-500/50 hover:bg-gray-800/90 transition-all duration-200 hover:-translate-y-0.5
                hover:shadow-lg hover:shadow-blue-500/10 active:scale-[0.99]"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-gray-100 group-hover:text-blue-300 transition-colors">
          {task.title}
        </h3>
        {task.priority && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${priorityColor(task.priority)}`}>
            {task.priority}
          </span>
        )}
      </div>
      
      {task.assignedTo && (
        <div className="flex items-center gap-2 mt-3">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600/20 to-indigo-700/20 
                        flex items-center justify-center">
            <span className="text-xs">{task.assignedTo.name.charAt(0)}</span>
          </div>
          <p className="text-xs text-gray-300">
            {task.assignedTo.name}
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskCard;