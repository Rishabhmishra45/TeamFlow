import Task from "../models/Task.js";
import Column from "../models/Column.js";
import Project from "../models/Project.js";
import Workspace from "../models/Workspace.js";

// ================= CREATE TASK =================
export const createTask = async (req, res) => {
  try {
    const { title, description, projectId, columnId, order, assignedTo } =
      req.body;

    if (!title || !projectId || !columnId || order === undefined) {
      return res.status(400).json({
        message: "Title, projectId, columnId and order are required",
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const column = await Column.findById(columnId);
    if (!column) {
      return res.status(404).json({ message: "Column not found" });
    }

    const workspace = await Workspace.findById(project.workspace);

    const isMember = workspace.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not allowed to create tasks",
      });
    }

    const task = await Task.create({
      title,
      description,
      project: projectId,
      column: columnId,
      order,
      assignedTo: assignedTo || null,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET TASKS BY COLUMN =================
export const getTasksByColumn = async (req, res) => {
  try {
    const { columnId } = req.params;

    const column = await Column.findById(columnId);
    if (!column) {
      return res.status(404).json({ message: "Column not found" });
    }

    const project = await Project.findById(column.project);
    const workspace = await Workspace.findById(project.workspace);

    const isMember = workspace.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not allowed to view tasks",
      });
    }

    const tasks = await Task.find({ column: columnId })
      .populate("assignedTo", "name email")
      .sort({ order: 1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE TASK =================
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, columnId, order, assignedTo } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.project);
    const workspace = await Workspace.findById(project.workspace);

    const isMember = workspace.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not allowed to update tasks",
      });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (columnId !== undefined) task.column = columnId;
    if (order !== undefined) task.order = order;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;

    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE TASK =================
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.project);
    const workspace = await Workspace.findById(project.workspace);

    const isMember = workspace.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not allowed to delete tasks",
      });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
