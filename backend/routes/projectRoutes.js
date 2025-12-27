import express from "express";
import Project from "../models/Project.js";
import Workspace from "../models/Workspace.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/* ================= CREATE PROJECT ================= */
router.post("/", protect, async (req, res) => {
  try {
    const { name, description, workspaceId } = req.body;

    if (!name || !workspaceId) {
      return res.status(400).json({ message: "Name & workspace required" });
    }

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const isMember = workspace.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const project = await Project.create({
      name,
      description,
      workspace: workspaceId,
      createdBy: req.user._id,
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= GET PROJECTS BY WORKSPACE ================= */
router.get("/:workspaceId", protect, async (req, res) => {
  try {
    const projects = await Project.find({
      workspace: req.params.workspaceId,
    });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
