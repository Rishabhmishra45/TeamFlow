import express from "express";
import Task from "../models/Task.js";
import ActivityLog from "../models/ActivityLog.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/* ================= CREATE TASK ================= */
router.post("/", protect, async (req, res) => {
  const { title, columnId, projectId } = req.body;

  if (!title || !columnId || !projectId) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const task = await Task.create({
    title,
    column: columnId,
    project: projectId,
  });

  await ActivityLog.create({
    task: task._id,
    action: "Task created",
    user: req.user._id,
  });

  res.status(201).json(task);
});

/* ================= GET TASKS BY PROJECT ================= */
router.get("/:projectId", protect, async (req, res) => {
  const tasks = await Task.find({
    project: req.params.projectId,
  });

  res.json(tasks);
});

/* ================= MOVE TASK (DRAG & DROP) ================= */
router.patch("/:id", protect, async (req, res) => {
  const { columnId } = req.body;

  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { column: columnId },
    { new: true }
  );

  await ActivityLog.create({
    task: task._id,
    action: "Task moved",
    user: req.user._id,
  });

  res.json(task);
});

/* ================= UPDATE TASK DETAILS ================= */
router.patch("/:id/details", protect, async (req, res) => {
  const { title, description, priority } = req.body;

  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { title, description, priority },
    { new: true }
  );

  await ActivityLog.create({
    task: task._id,
    action: "Task updated",
    user: req.user._id,
  });

  res.json(task);
});

/* ================= DELETE TASK ================= */
router.delete("/:id", protect, async (req, res) => {
  await ActivityLog.create({
    task: req.params.id,
    action: "Task deleted",
    user: req.user._id,
  });

  await Task.findByIdAndDelete(req.params.id);

  res.json({ message: "Task deleted" });
});

export default router;
