import express from "express";
import Notification from "../models/Notification.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/* GET USER NOTIFICATIONS */
router.get("/", protect, async (req, res) => {
  const notifications = await Notification.find({
    user: req.user._id,
  }).sort({ createdAt: -1 });

  res.json(notifications);
});

/* MARK AS READ */
router.patch("/:id/read", protect, async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, {
    read: true,
  });
  res.json({ success: true });
});

export default router;
