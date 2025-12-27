import express from "express";
import Column from "../models/Column.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/* CREATE COLUMN */
router.post("/", protect, async (req, res) => {
  try {
    const { title, projectId } = req.body;
    if (!title || !projectId) {
      return res
        .status(400)
        .json({ message: "Title & project required" });
    }

    const column = await Column.create({
      title,
      project: projectId,
    });

    res.status(201).json(column);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* GET COLUMNS BY PROJECT */
router.get("/:projectId", protect, async (req, res) => {
  try {
    const columns = await Column.find({
      project: req.params.projectId,
    }).sort({ order: 1 });

    res.json(columns);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
