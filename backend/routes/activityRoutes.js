import express from "express";
import ActivityLog from "../models/ActivityLog.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/:taskId", protect, async (req, res) => {
  const logs = await ActivityLog.find({
    task: req.params.taskId,
  })
    .populate("user", "name")
    .sort({ createdAt: -1 });

  res.json(logs);
});

export default router;
