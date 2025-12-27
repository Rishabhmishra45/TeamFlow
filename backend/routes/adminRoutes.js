import express from "express";
import User from "../models/User.js";
import Workspace from "../models/Workspace.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import { protect } from "../middleware/auth.js";
import { adminOnly } from "../middleware/admin.js";

const router = express.Router();

/* ================= USERS ================= */
router.get("/users", protect, adminOnly, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

router.patch("/users/:id/role", protect, adminOnly, async (req, res) => {
  const { role } = req.body;
  await User.findByIdAndUpdate(req.params.id, { role });
  res.json({ success: true });
});

router.patch("/users/:id/status", protect, adminOnly, async (req, res) => {
  const { active } = req.body;
  await User.findByIdAndUpdate(req.params.id, { active });
  res.json({ success: true });
});

/* ================= WORKSPACES ================= */
router.get("/workspaces", protect, adminOnly, async (req, res) => {
  const workspaces = await Workspace.find().populate("owner", "name email");
  res.json(workspaces);
});

router.delete("/workspaces/:id", protect, adminOnly, async (req, res) => {
  await Workspace.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

/* ================= PROJECT MONITOR ================= */
router.get("/projects", protect, adminOnly, async (req, res) => {
  const projects = await Project.find().populate("workspace", "name");
  res.json(projects);
});

/* ================= SYSTEM STATS ================= */
router.get("/stats", protect, adminOnly, async (req, res) => {
  const users = await User.countDocuments();
  const workspaces = await Workspace.countDocuments();
  const projects = await Project.countDocuments();
  const tasks = await Task.countDocuments();

  res.json({
    users,
    workspaces,
    projects,
    tasks,
  });
});

export default router;
