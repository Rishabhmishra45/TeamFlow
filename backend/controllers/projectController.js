import Project from "../models/Project.js";
import Workspace from "../models/Workspace.js";

// ================= CREATE PROJECT =================
export const createProject = async (req, res) => {
  try {
    const { name, description, workspaceId } = req.body;

    if (!name || !workspaceId) {
      return res.status(400).json({
        message: "Project name and workspaceId are required",
      });
    }

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Check if user is part of workspace
    const isMember = workspace.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this workspace",
      });
    }

    const project = await Project.create({
      name,
      description,
      workspace: workspaceId,
      createdBy: req.user._id,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET PROJECTS BY WORKSPACE =================
export const getProjectsByWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const isMember = workspace.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not allowed to view these projects",
      });
    }

    const projects = await Project.find({ workspace: workspaceId }).sort({
      createdAt: -1,
    });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
