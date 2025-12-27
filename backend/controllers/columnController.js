import Column from "../models/Column.js";
import Project from "../models/Project.js";
import Workspace from "../models/Workspace.js";

// ================= CREATE COLUMN =================
export const createColumn = async (req, res) => {
  try {
    const { name, projectId, order } = req.body;

    if (!name || !projectId || order === undefined) {
      return res.status(400).json({
        message: "Name, projectId and order are required",
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const workspace = await Workspace.findById(project.workspace);

    const isMember = workspace.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not allowed to add columns",
      });
    }

    const column = await Column.create({
      name,
      project: projectId,
      order,
    });

    res.status(201).json(column);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET COLUMNS BY PROJECT =================
export const getColumnsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const workspace = await Workspace.findById(project.workspace);

    const isMember = workspace.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not allowed to view columns",
      });
    }

    const columns = await Column.find({ project: projectId }).sort({
      order: 1,
    });

    res.json(columns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE COLUMN (ORDER / NAME) =================
export const updateColumn = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, order } = req.body;

    const column = await Column.findById(id);
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
        message: "You are not allowed to update column",
      });
    }

    if (name !== undefined) column.name = name;
    if (order !== undefined) column.order = order;

    await column.save();

    res.json(column);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
